import { useState } from 'react';
import { menuItems } from '../../data/mockData';
import { MenuItem, CartItem, User } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Plus, ShoppingCart, Calendar, Search, Clock, Star, Flame, Award } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import { formatBDT } from '../../utils/currency';

interface LandingPageProps {
  cart: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onNavigate: (page: string) => void;
  currentUser?: User | null;
}

export function LandingPage({ cart, onAddToCart, onNavigate, currentUser }: LandingPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];
  
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
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

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-xl p-8 mb-6">
          <h1 className="text-4xl mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to BeanBuzz Coffee & Bistro
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Experience artisan coffee, gourmet cuisine, and exceptional service in the heart of the city. 
            From signature espresso drinks to handcrafted meals, every item is prepared with passion and precision.
          </p>
          
          {/* Quick Stats */}
          <div className="flex gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Fresh daily · 15-25 min prep</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-muted-foreground">4.8/5 customer rating</span>
            </div>
          </div>
        </div>
      </motion.div>



      {/* Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="flex gap-4">
          <Button 
            onClick={() => onNavigate('cart')} 
            className="flex items-center gap-2 relative"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart ({cartItemsCount})
            {cartItemsCount > 0 && (
              <Badge className="absolute -top-2 -right-2 px-1.5 min-w-[20px] h-5 text-xs">
                {cartItemsCount}
              </Badge>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onNavigate('reservations')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Reserve Table
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex gap-2 mb-8 flex-wrap"
      >
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            size="sm"
            className="transition-all duration-200 hover:scale-105"
          >
            {category}
            {category !== 'All' && (
              <Badge variant="secondary" className="ml-2">
                {menuItems.filter(item => item.category === category).length}
              </Badge>
            )}
          </Button>
        ))}
      </motion.div>

      {/* Featured Items Banner */}
      {selectedCategory === 'All' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-medium">Today's Featured Items</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span>Signature BeanBuzz Espresso - House Specialty</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Truffle Beef Burger - Customer Favorite</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-500" />
                <span>Fresh Seasonal Fruit Tart - Limited Time</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Menu Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredItems.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] relative group">
              {/* Special Badges */}
              <div className="absolute top-2 left-2 z-10 flex gap-1">
                {item.isSignature && (
                  <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                    <Award className="h-3 w-3 mr-1" />
                    Signature
                  </Badge>
                )}
                {item.isPopular && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>

              <div className="aspect-video bg-muted relative overflow-hidden">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {!item.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive">Out of Stock</Badge>
                  </div>
                )}
                
                {/* Preparation Time */}
                {item.prepTime && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.prepTime}min
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-1">{item.name}</CardTitle>
                  <div className="flex flex-col items-end">
                    <Badge variant="secondary" className="text-lg px-2">
                      {formatBDT(item.price)}
                    </Badge>
                    {item.calories && (
                      <span className="text-xs text-muted-foreground mt-1">
                        {item.calories} cal
                      </span>
                    )}
                  </div>
                </div>
                <CardDescription className="line-clamp-2 text-sm">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <Button 
                  onClick={() => onAddToCart(item)}
                  disabled={!item.available}
                  className="w-full transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* No Results */}
      {filteredItems.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No items found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </motion.div>
      )}
    </div>
  );
}