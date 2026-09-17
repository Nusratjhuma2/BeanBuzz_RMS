import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Coffee, User, Briefcase } from 'lucide-react';
import { UserRole } from '../../types';
import { toast } from 'sonner@2.0.3';

interface LoginPageProps {
  onLogin: (email: string, password: string, role?: UserRole) => boolean;
  onRegister: (name: string, email: string, password: string, phone?: string) => boolean;
}

export function LoginPage({ onLogin, onRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  
  // Registration form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    onLogin(email, password, role);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!regName || !regEmail || !regPassword || !regConfirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (regPassword !== regConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (regPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    // Register the user
    const success = onRegister(regName, regEmail, regPassword, regPhone);
    if (success) {
      // Reset form
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setRegPhone('');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Coffee className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to BeanBuzz</CardTitle>
          <CardDescription>
            Sign in or create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="customer" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customer" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer
              </TabsTrigger>
              <TabsTrigger value="employee" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Employee
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customer" className="space-y-4 mt-4">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4 mt-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer-email">Email</Label>
                      <Input
                        id="customer-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customer-password">Password</Label>
                      <Input
                        id="customer-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" onClick={() => setRole('customer')}>
                      Sign In as Customer
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-4 mt-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name">Full Name</Label>
                      <Input
                        id="reg-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="Enter your email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-phone">Phone Number</Label>
                      <Input
                        id="reg-phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="Create a password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-confirm-password">Confirm Password</Label>
                      <Input
                        id="reg-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="employee" className="space-y-4 mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employee-email">Employee ID or Email</Label>
                  <Input
                    id="employee-email"
                    type="text"
                    placeholder="Enter your employee ID or email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employee-password">Password</Label>
                  <Input
                    id="employee-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employee-role">Role</Label>
                  <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="waiter">Waiter</SelectItem>
                      <SelectItem value="chef">Chef</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">
                  Sign In as Employee
                </Button>
              </form>

              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground text-center">
                  Employee accounts are created by management only.
                  Contact your manager if you need access.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-4 p-3 bg-muted rounded-md">
            <h4 className="font-medium mb-2">Demo Accounts:</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Customer:</strong> alice@email.com / password123</p>
              <p><strong>Waiter:</strong> john.smith@beanbuzz.com / emp123</p>
              <p><strong>Chef:</strong> sarah.johnson@beanbuzz.com / emp123</p>
              <p><strong>Manager:</strong> david.wilson@beanbuzz.com / emp123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}