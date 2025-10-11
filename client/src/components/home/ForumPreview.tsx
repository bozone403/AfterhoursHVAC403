import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { Link } from 'wouter';
import { formatDistanceToNow } from 'date-fns';

// Sample forum posts for preview (in production, these would come from API)
const sampleForumPosts = [
  {
    id: 1,
    title: "Best practices for furnace maintenance in Calgary winters",
    content: "Looking for advice on maintaining my gas furnace during the harsh Calgary winters. What should I be checking monthly?",
    author: "HomeownerYYC",
    createdAt: "2024-12-15T10:30:00Z",
    replies: 8,
    category: "Maintenance Tips",
    excerpt: "What are the key maintenance tasks I should be doing to keep my furnace running efficiently through winter?"
  },
  {
    id: 2,
    title: "Heat pump vs gas furnace for new construction",
    content: "Building a new home in Airdrie and trying to decide between a heat pump system and traditional gas furnace. What are the pros and cons?",
    author: "BuilderAB",
    createdAt: "2024-12-14T14:20:00Z",
    replies: 12,
    category: "Equipment Discussion",
    excerpt: "Comparing efficiency, costs, and performance for new home construction in Alberta climate."
  },
  {
    id: 3,
    title: "Strange noise from ductwork - should I be concerned?",
    content: "Started hearing a metallic ticking sound from my ductwork when the furnace starts up. Is this normal expansion or something to worry about?",
    author: "ConcernedHomeowner",
    createdAt: "2024-12-13T16:45:00Z",
    replies: 5,
    category: "Troubleshooting",
    excerpt: "Troubleshooting unusual sounds coming from HVAC ductwork during startup cycles."
  },
  {
    id: 4,
    title: "Energy efficient upgrades worth the investment?",
    content: "Considering upgrading to a high-efficiency furnace and adding zone controls. What's the typical payback period for these upgrades?",
    author: "EcoFriendlyYYC",
    createdAt: "2024-12-12T09:15:00Z",
    replies: 15,
    category: "Energy Efficiency",
    excerpt: "ROI analysis for high-efficiency HVAC upgrades and smart zone control systems."
  },
  {
    id: 5,
    title: "DIY filter replacement vs professional service",
    content: "How often should I replace my furnace filter myself vs calling for professional maintenance? Want to balance cost with proper care.",
    author: "DIYDave",
    createdAt: "2024-12-11T11:30:00Z",
    replies: 7,
    category: "Maintenance Tips",
    excerpt: "Finding the right balance between DIY maintenance and professional HVAC service calls."
  }
];

const ForumPreview = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === sampleForumPosts.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextPost = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === sampleForumPosts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevPost = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? sampleForumPosts.length - 1 : prevIndex - 1
    );
  };

  const currentPost = sampleForumPosts[currentIndex];

  return (
    <section className="bg-slate-900 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-header text-white mb-4">
            Community Discussions
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Join our HVAC community to share experiences, get expert advice, and learn from other homeowners and professionals.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700 relative overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {currentPost.category}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevPost}
                    className="text-slate-400 hover:text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextPost}
                    className="text-slate-400 hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-white text-xl">
                {currentPost.title}
              </CardTitle>
              <CardDescription className="text-slate-300">
                {currentPost.excerpt}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{currentPost.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDistanceToNow(new Date(currentPost.createdAt), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{currentPost.replies} replies</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-300 mb-6 line-clamp-3">
                {currentPost.content}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/forum">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Join the Discussion
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
                    Sign Up to Participate
                  </Button>
                </Link>
              </div>
            </CardContent>

            {/* Progress indicators */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {sampleForumPosts.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-blue-400' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ForumPreview;