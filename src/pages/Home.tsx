import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Star,
  ArrowRight,
  CircleDot,
  Trash2,
  Droplets,
  Lightbulb,
  Zap,
  Waves,
  Construction,
  Building2,
  Volume2,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { APP_NAME, APP_TAGLINE, CATEGORIES } from '@/utils/constants';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const stats = [
    { label: 'Complaints Reported', value: '10,000+', icon: FileText },
    { label: 'Issues Resolved', value: '8,500+', icon: CheckCircle2 },
    { label: 'Citizen Satisfaction', value: '4.5/5', icon: Star },
    { label: 'Avg. Resolution Time', value: '3.5 days', icon: Clock },
  ];

  const features = [
    {
      icon: FileText,
      title: 'Easy Reporting',
      description: 'Report civic issues in just a few clicks with our user-friendly interface.',
    },
    {
      icon: MapPin,
      title: 'Location Tracking',
      description: 'Pinpoint exact locations on the map for faster resolution.',
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Track the status of your complaints in real-time.',
    },
    {
      icon: Shield,
      title: 'Transparent Process',
      description: 'Complete visibility into the complaint resolution process.',
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Report Issue',
      description: 'Fill out a simple form with details about the civic issue.',
      icon: FileText,
    },
    {
      step: 2,
      title: 'Track Progress',
      description: 'Receive real-time updates on your complaint status.',
      icon: TrendingUp,
    },
    {
      step: 3,
      title: 'Get Resolved',
      description: 'Municipal authorities address and resolve the issue.',
      icon: CheckCircle2,
    },
  ];

  const categoryIcons: Record<string, React.ElementType> = {
    pothole: CircleDot,
    garbage: Trash2,
    water_leakage: Droplets,
    street_light: Lightbulb,
    electricity: Zap,
    drainage: Waves,
    road_damage: Construction,
    illegal_construction: Building2,
    noise_pollution: Volume2,
    other: HelpCircle,
  };

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                #1 Civic Complaint Platform
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Report Civic Issues.
                <br />
                <span className="text-blue-200">Get Them Resolved.</span>
              </h1>
              <p className="text-xl text-blue-100 max-w-lg">
                {APP_TAGLINE} Join thousands of citizens making a difference in their communities.
              </p>
              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-700 hover:bg-blue-50"
                    onClick={() => navigate('/report')}
                  >
                    Report an Issue
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      className="bg-white text-blue-700 hover:bg-blue-50"
                      onClick={() => navigate('/register')}
                    >
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-white text-white hover:bg-white/10"
                      onClick={() => navigate('/login')}
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-2xl" />
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
                  alt="City"
                  className="relative rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <stat.icon className="w-8 h-8 mx-auto text-blue-600 mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose {APP_NAME}?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides everything you need to report and track civic issues effectively.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting your civic issues resolved is as easy as 1-2-3.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 relative">
                    <item.icon className="w-8 h-8 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Report Any Civic Issue
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From potholes to street lights, report any issue affecting your community.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(CATEGORIES).map(([key, category]) => {
              const Icon = categoryIcons[key] || HelpCircle;
              return (
                <Card 
                  key={key} 
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => navigate(isAuthenticated ? '/report' : '/register')}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <h3 className="font-medium text-gray-900">{category.label}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of citizens who are actively improving their communities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <Button 
                size="lg" 
                className="bg-white text-blue-700 hover:bg-blue-50"
                onClick={() => navigate('/report')}
              >
                Report an Issue Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-white text-blue-700 hover:bg-blue-50"
                  onClick={() => navigate('/register')}
                >
                  Create Free Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
