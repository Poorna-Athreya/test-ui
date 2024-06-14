import { Button } from '@/components/ui/button';
import { Home, User, Coffee } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('hire');

  return (
    (<div className="flex flex-col min-h-screen bg-pink-100">
      <header className="bg-pink-200 p-4 shadow-md flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pink-600">WriteAway</h1>
        <nav className="flex space-x-4">
          <Button variant="outline" className="text-pink-600 border-pink-600 hover:bg-pink-600 hover:text-white">
            <Home className="mr-2" /> Home
          </Button>
          <Button variant="outline" className="text-pink-600 border-pink-600 hover:bg-pink-600 hover:text-white">
            <User className="mr-2" /> About Us
          </Button>
        </nav>
      </header>
      <main className="flex-1 p-6">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-pink-600 mb-4">Hire or Become a Professional Writer</h2>
          <p className="text-pink-700">Join our community of talented writers or find the perfect writer for your project!</p>
        </div>
        <Tabs defaultValue="hire" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="justify-center mb-6">
            <TabsTrigger value="hire" className={`px-6 py-2 rounded-t-lg ${activeTab === 'hire' ? 'bg-pink-300 text-pink-700' : 'bg-pink-200 text-pink-600'}`}>
              Hire a Writer
            </TabsTrigger>
            <TabsTrigger value="register" className={`px-6 py-2 rounded-t-lg ${activeTab === 'register' ? 'bg-pink-300 text-pink-700' : 'bg-pink-200 text-pink-600'}`}>
              Register as a Writer
            </TabsTrigger>
          </TabsList>
          <TabsContent value="hire" className="bg-pink-300 p-6 rounded-lg shadow-inner">
            <form className="space-y-4">
              <Input placeholder="Enter your email" className="w-full" />
              <Textarea placeholder="Describe your project" className="w-full" rows={4} />
              <Button className="bg-pink-600 text-white w-full">Find Writers</Button>
            </form>
          </TabsContent>
          <TabsContent value="register" className="bg-pink-300 p-6 rounded-lg shadow-inner">
            <form className="space-y-4">
              <Input placeholder="Enter your name" className="w-full" />
              <Input placeholder="Enter your email" className="w-full" />
              <Textarea placeholder="Tell us about your writing experience" className="w-full" rows={4} />
              <Button className="bg-pink-600 text-white w-full">Join as Writer</Button>
            </form>
          </TabsContent>
        </Tabs>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => (
            <Card key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <CardHeader className="flex items-center space-x-4 p-4 bg-pink-200">
                <Avatar>
                  <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 1}`} />
                  <AvatarFallback delayMs={600}>W</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg font-semibold text-pink-700">Writer {i + 1}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-pink-600">Specializes in creative writing, blogs, and essays.</p>
              </CardContent>
              <CardFooter className="p-4 bg-pink-100 flex justify-between items-center">
                <Button variant="outline" className="text-pink-600 border-pink-600 hover:bg-pink-600 hover:text-white">
                  <div className="mr-2" /> View Profile
                </Button>
                <Button className="bg-pink-600 text-white">
                  <Coffee className="mr-2" /> Hire Me
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <footer className="bg-pink-200 p-4 text-center">
        <p className="text-pink-700">&copy; 2023 WriteAway. All rights reserved.</p>
      </footer>
    </div>)
  );
}