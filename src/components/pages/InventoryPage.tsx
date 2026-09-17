import { useState } from 'react';
import { inventoryItems } from '../../data/mockData';
import { InventoryItem, UserRole } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertTriangle, CheckCircle, XCircle, Edit, Plus, Minus, Package, TrendingDown, TrendingUp, Calendar, Truck } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';

interface InventoryPageProps {
  userRole?: UserRole;
}

export function InventoryPage({ userRole = 'guest' }: InventoryPageProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>(inventoryItems);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [restockNotes, setRestockNotes] = useState<{[key: string]: string}>({});

  const canEdit = userRole === 'chef' || userRole === 'manager';
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'low':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'out':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'default';
      case 'low':
        return 'secondary';
      case 'out':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getProgress = (quantity: number, minLevel: number) => {
    const maxLevel = minLevel * 4; // Assume max is 4x min level for better visualization
    return Math.min((quantity / maxLevel) * 100, 100);
  };

  const getProgressColor = (quantity: number, minLevel: number) => {
    if (quantity === 0) return 'bg-red-500';
    if (quantity <= minLevel) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const updateStock = (itemId: string, newQuantity: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, quantity: Math.max(0, newQuantity) };
        // Update status based on quantity
        if (updatedItem.quantity === 0) {
          updatedItem.status = 'out';
        } else if (updatedItem.quantity <= updatedItem.minLevel) {
          updatedItem.status = 'low';
        } else {
          updatedItem.status = 'ok';
        }
        return updatedItem;
      }
      return item;
    }));
    toast.success('Stock updated successfully');
  };

  const updateItem = (itemId: string, updates: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
    toast.success('Item updated successfully');
    setEditingItem(null);
  };

  const markAsRestocked = (itemId: string, quantity: number) => {
    const today = new Date().toISOString().split('T')[0];
    updateItem(itemId, {
      quantity,
      lastRestocked: today,
      status: quantity <= inventoryItems.find(i => i.id === itemId)?.minLevel || 0 ? 'low' : 'ok'
    });
    setRestockNotes(prev => ({ ...prev, [itemId]: '' }));
    toast.success('Item restocked successfully');
  };

  const filteredInventory = inventory.filter(item => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const summaryStats = {
    total: inventory.length,
    inStock: inventory.filter(item => item.status === 'ok').length,
    lowStock: inventory.filter(item => item.status === 'low').length,
    outOfStock: inventory.filter(item => item.status === 'out').length
  };

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl mb-2">Inventory Management</h1>
        <p className="text-muted-foreground">
          Monitor ingredient levels, track stock status, and manage restocking
        </p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <motion.div variants={cardVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.total}</div>
              <p className="text-xs text-muted-foreground">In inventory</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Stock</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{summaryStats.inStock}</div>
              <p className="text-xs text-muted-foreground">Adequate levels</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <TrendingDown className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{summaryStats.lowStock}</div>
              <p className="text-xs text-muted-foreground">Need restocking</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{summaryStats.outOfStock}</div>
              <p className="text-xs text-muted-foreground">Urgent restock</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-2 mb-6 flex-wrap"
      >
        {[
          { key: 'all', label: 'All Items', count: summaryStats.total },
          { key: 'ok', label: 'In Stock', count: summaryStats.inStock },
          { key: 'low', label: 'Low Stock', count: summaryStats.lowStock },
          { key: 'out', label: 'Out of Stock', count: summaryStats.outOfStock }
        ].map(filter => (
          <Button
            key={filter.key}
            variant={filterStatus === filter.key ? 'default' : 'outline'}
            onClick={() => setFilterStatus(filter.key)}
            size="sm"
            className="transition-all duration-200"
          >
            {filter.label}
            <Badge variant="secondary" className="ml-2">
              {filter.count}
            </Badge>
          </Button>
        ))}
      </motion.div>

      {/* Inventory Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredInventory.map((item) => (
          <motion.div key={item.id} variants={cardVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-200 relative">
              {/* Urgent indicator */}
              {item.status === 'out' && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  URGENT
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    {canEdit && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingItem(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Edit {item.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Quantity</Label>
                                <Input
                                  type="number"
                                  defaultValue={item.quantity}
                                  onChange={(e) => {
                                    if (editingItem) {
                                      setEditingItem({
                                        ...editingItem,
                                        quantity: parseInt(e.target.value) || 0
                                      });
                                    }
                                  }}
                                />
                              </div>
                              <div>
                                <Label>Unit</Label>
                                <Input
                                  defaultValue={item.unit}
                                  onChange={(e) => {
                                    if (editingItem) {
                                      setEditingItem({
                                        ...editingItem,
                                        unit: e.target.value
                                      });
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label>Minimum Level</Label>
                              <Input
                                type="number"
                                defaultValue={item.minLevel}
                                onChange={(e) => {
                                  if (editingItem) {
                                    setEditingItem({
                                      ...editingItem,
                                      minLevel: parseInt(e.target.value) || 0
                                    });
                                  }
                                }}
                              />
                            </div>

                            <div>
                              <Label>Supplier</Label>
                              <Input
                                defaultValue={item.supplier || ''}
                                onChange={(e) => {
                                  if (editingItem) {
                                    setEditingItem({
                                      ...editingItem,
                                      supplier: e.target.value
                                    });
                                  }
                                }}
                              />
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                onClick={() => {
                                  if (editingItem) {
                                    updateItem(item.id, editingItem);
                                  }
                                }}
                                className="flex-1"
                              >
                                Save Changes
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setEditingItem(null)}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
                {item.supplier && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    {item.supplier}
                  </p>
                )}
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Current Stock</span>
                    <Badge variant={getStatusColor(item.status) as any}>
                      {item.quantity} {item.unit}
                    </Badge>
                  </div>
                  
                  {canEdit && (
                    <div className="flex items-center justify-center gap-2 p-2 bg-muted rounded-lg">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStock(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 0}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-2 min-w-[60px] text-center font-medium">
                        {item.quantity} {item.unit}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStock(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Stock Level</span>
                      <span>{Math.round(getProgress(item.quantity, item.minLevel))}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(item.quantity, item.minLevel)}`}
                        style={{ width: `${getProgress(item.quantity, item.minLevel)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Min Level: {item.minLevel} {item.unit}</div>
                    <div className="capitalize">Status: {item.status}</div>
                  </div>

                  {item.lastRestocked && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Last restocked: {item.lastRestocked}</span>
                    </div>
                  )}

                  {/* Status alerts */}
                  {item.status === 'low' && (
                    <div className="text-sm text-yellow-700 bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Stock running low</span>
                      </div>
                      <p className="mt-1">Consider restocking soon to avoid shortage.</p>
                      
                      {canEdit && (
                        <div className="mt-3 space-y-2">
                          <Input
                            type="number"
                            placeholder="Restock quantity"
                            value={restockNotes[item.id] || ''}
                            onChange={(e) => setRestockNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                          />
                          <Button
                            size="sm"
                            onClick={() => {
                              const quantity = parseInt(restockNotes[item.id] || '0');
                              if (quantity > 0) {
                                markAsRestocked(item.id, item.quantity + quantity);
                              }
                            }}
                            disabled={!restockNotes[item.id] || parseInt(restockNotes[item.id]) <= 0}
                          >
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Restock
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {item.status === 'out' && (
                    <div className="text-sm text-red-700 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        <span className="font-medium">Out of stock!</span>
                      </div>
                      <p className="mt-1">Immediate restocking required. Service may be affected.</p>
                      
                      {canEdit && (
                        <div className="mt-3 space-y-2">
                          <Input
                            type="number"
                            placeholder="Restock quantity"
                            value={restockNotes[item.id] || ''}
                            onChange={(e) => setRestockNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              const quantity = parseInt(restockNotes[item.id] || '0');
                              if (quantity > 0) {
                                markAsRestocked(item.id, quantity);
                              }
                            }}
                            disabled={!restockNotes[item.id] || parseInt(restockNotes[item.id]) <= 0}
                          >
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Urgent Restock
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredInventory.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl mb-2">No items found</h2>
          <p className="text-muted-foreground">
            {filterStatus === 'all' 
              ? 'No inventory items available.'
              : `No items with status "${filterStatus}".`
            }
          </p>
        </motion.div>
      )}
    </div>
  );
}