import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! I am your Civic Resolve Assistant. How can I help you today?',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');

        // Simulate bot response
        setTimeout(() => {
            const botResponse = getBotResponse(userMessage.text);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: botResponse,
                sender: 'bot',
                timestamp: new Date()
            }]);
        }, 1000);
    };

    const getBotResponse = (text: string): string => {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('report') || lowerText.includes('complaint') || lowerText.includes('issue')) {
            return 'To report an issue, go to the "Report Issue" page in the navigation menu. Fill out the form with the details and location of the problem.';
        }
        if (lowerText.includes('status') || lowerText.includes('track') || lowerText.includes('check')) {
            return 'You can track the status of your reported issues in the "My Complaints" or "Dashboard" section.';
        }
        if (lowerText.includes('contact') || lowerText.includes('help') || lowerText.includes('support')) {
            return 'If you need further assistance, you can contact our support team at support@civicresolve.com or call our helpline.';
        }
        if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
            return 'Hi there! How can I assist you with civic issues today?';
        }
        if (lowerText.includes('thank')) {
            return 'You\'re welcome! Let me know if you need anything else.';
        }

        return 'I\'m not sure I understand. You can ask me about reporting issues, checking status, or contact support.';
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <Card className="w-80 h-96 shadow-xl flex flex-col">
                    <CardHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center space-x-2">
                            <Bot className="w-6 h-6" />
                            <CardTitle className="text-sm font-medium">Civic Assistant</CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.sender === 'user'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>
                        <form onSubmit={handleSendMessage} className="p-3 border-t bg-background flex gap-2">
                            <Input
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1"
                            />
                            <Button type="submit" size="icon" disabled={!inputText.trim()}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="rounded-full h-14 w-14 shadow-lg"
                    size="icon"
                >
                    <MessageCircle className="w-8 h-8" />
                </Button>
            )}
        </div>
    );
};
