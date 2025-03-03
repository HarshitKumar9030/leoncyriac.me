"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  ChevronUp,
  Loader2,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  CornerDownLeft,
  Trash2,
  Calendar,
  Gift,
  Volume2,
  Share2,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isFavorite?: boolean; // New property
  reactions?: string[]; // New property
}

interface BlogChatBotProps {
  blogTitle: string;
  blogContent: string;
  postSlug: string;
}

export default function BlogChatBot({
  blogTitle,
  blogContent,
  postSlug,
}: BlogChatBotProps) {
  const [remainingChats, setRemainingChats] = useState<number | null>(null);
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);
  const [redeemCode, setRedeemCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const MAX_DAILY_CHATS = 15;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatLoaded, setChatLoaded] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [helpOpen, setHelpOpen] = useState(false);

  // Add initial greeting or fetch chat history when chat opens
  useEffect(() => {
    if (isOpen && !chatLoaded && status === "authenticated") {
      setChatLoaded(true);
      const fetchChatHistory = async () => {
        try {
          const response = await fetch(
            `/api/chat/history?postSlug=${encodeURIComponent(postSlug)}`
          );

          if (!response.ok) {
            // If no history, add welcome message
            setMessages([
              {
                id: "welcome",
                content: `Hello! I'm your AI assistant for "${blogTitle}". How can I help you understand this article better?`,
                role: "assistant",
                timestamp: new Date(),
              },
            ]);
            return;
          }

          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            // Format timestamps properly
            const formattedMessages = data.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            }));
            setMessages(formattedMessages);
          } else {
            // If empty history, add welcome message
            setMessages([
              {
                id: "welcome",
                content: `Hello! I'm your AI assistant for "${blogTitle}". How can I help you understand this article better?`,
                role: "assistant",
                timestamp: new Date(),
              },
            ]);
          }
        } catch (error) {
          console.error("Failed to fetch chat history:", error);
          // Fallback to welcome message
          setMessages([
            {
              id: "welcome",
              content: `Hello! I'm your AI assistant for "${blogTitle}". How can I help you understand this article better?`,
              role: "assistant",
              timestamp: new Date(),
            },
          ]);
        }
      };
      fetchChatHistory();
    }
  }, [isOpen, chatLoaded, status, blogTitle, postSlug]);

  // Reset chat loaded state when closed
  useEffect(() => {
    if (!isOpen) {
      setChatLoaded(false);
    }
  }, [isOpen]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Add this useEffect after your other effects
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      // Fetch remaining chat count
      const fetchRemainingChats = async () => {
        try {
          const response = await fetch("/api/chat/limits");
          if (!response.ok) throw new Error("Failed to fetch chat limits");

          const data = await response.json();
          setRemainingChats(data.remainingChats);
        } catch (error) {
          console.error("Error fetching chat limits:", error);
          // Default to max if we can't fetch the actual count
          setRemainingChats(MAX_DAILY_CHATS);
        }
      };

      fetchRemainingChats();
    }
  }, [status, session?.user?.email]);

  // Add this function to handle redeem codes
  const handleRedeemCode = async () => {
    if (!redeemCode.trim()) return;

    setIsRedeeming(true);
    try {
      const response = await fetch("/api/chat/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: redeemCode.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Invalid code");
      }

      const data = await response.json();
      setRemainingChats((prev) => (prev || 0) + data.extraChats);

      toast({
        title: "Code redeemed successfully!",
        description: `You've received ${data.extraChats} additional chats.`,
      });

      setRedeemDialogOpen(false);
      setRedeemCode("");
    } catch (error: any) {
      toast({
        title: "Failed to redeem code",
        description: error.message || "Please try again with a valid code.",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  // Modify your handleSendMessage function
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (status !== "authenticated") {
      toast({
        title: "Sign in required",
        description: "Please sign in to chat about this article.",
        variant: "destructive",
      });
      return;
    }

    // Check if the user has reached their daily limit
    if (remainingChats !== null && remainingChats <= 0) {
      setRedeemDialogOpen(true);
      return;
    }

    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          blogTitle,
          blogContent,
          postSlug,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();

      // Update the formatting function
      let formattedResponse = formatResponseWithCodeBlocks(data.response);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: formattedResponse,
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Unable to get a response. Please try again.",
        variant: "destructive",
      });
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }

    // After successful response, update remaining chats
    if (remainingChats !== null) {
      setRemainingChats(remainingChats - 1);
    }
  };

  const formatResponseWithCodeBlocks = (text: string) => {
    // Handle markdown-style code blocks that might be improperly formatted
    let formattedText = text;

    // Ensure proper spacing for lists
    formattedText = formattedText.replace(/\*\s+([^\n]+)/g, "* $1\n");

    // Fix code blocks that might be missing proper formatting
    // Convert ```language\ncode\n``` to proper markdown
    formattedText = formattedText.replace(
      /```([a-zA-Z]*)\s*\n([\s\S]*?)\n```/g,
      "```$1\n$2\n```"
    );

    // Handle code blocks without language specification
    formattedText = formattedText.replace(
      /```\s*\n([\s\S]*?)\n```/g,
      "```\n$1\n```"
    );

    return formattedText;
  };

  const toggleChat = () => {
    if (!isOpen && status !== "authenticated") {
      toast({
        title: "Sign in required",
        description: "Please sign in to discuss this article with AI.",
        duration: 3000,
      });
      return;
    }
    setIsOpen(!isOpen);
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
    }).format(date instanceof Date ? date : new Date(date));
  };

  // Enhanced rendering function with better code block support
  const renderMessageContent = (
    content: string,
    role: "user" | "assistant"
  ) => {
    if (role === "user") {
      return <p className="whitespace-pre-wrap break-words">{content}</p>;
    }

    return (
      <div className="prose prose-sm dark:prose-invert max-w-none break-words">
        <ReactMarkdown
          components={{
            p: ({ node, ...props }) => (
              <p className="mb-2 last:mb-0" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="pl-4 mb-2 list-disc" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="pl-4 mb-2 list-decimal" {...props} />
            ),
            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            a: ({ node, ...props }) => (
              <a
                className="text-purple-600 hover:underline dark:text-purple-400"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
            strong: ({ node, ...props }) => (
              <strong
                className="font-semibold text-purple-700 dark:text-purple-300"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-base font-medium mt-3 mb-2" {...props} />
            ),
            // Enhanced code block rendering with syntax highlighting
            // @ts-ignore
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";

              if (!inline) {
                return (
                  <div className="my-3 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="bg-gray-800 text-gray-200 px-3 py-1 text-xs flex items-center justify-between">
                      <span>{language || "code"}</span>
                    </div>
                    <SyntaxHighlighter
                      language={language || "text"}
                      style={oneDark}
                      customStyle={{
                        margin: 0,
                        borderRadius: "0 0 0.375rem 0.375rem",
                      }}
                      className="!bg-zinc-900"
                      showLineNumbers
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                );
              }
              return (
                <code
                  className="px-1 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-xs font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  const toggleFavorite = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isFavorite: !msg.isFavorite } : msg
      )
    );

    // Add or remove from favorites list
    setFavorites((prev) => {
      if (prev.includes(messageId)) {
        return prev.filter((id) => id !== messageId);
      } else {
        return [...prev, messageId];
      }
    });
  };

  // Function to speak text aloud
  const speakMessage = (text: string) => {
    if ("speechSynthesis" in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Feature not supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      });
    }
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard.",
    });
  };

  // Function to clear chat history
  const clearChat = async () => {
    if (confirm("Are you sure you want to clear this chat history?")) {
      try {
        await fetch(
          `/api/chat/clear?postSlug=${encodeURIComponent(postSlug)}`,
          {
            method: "DELETE",
          }
        );

        setMessages([
          {
            id: "welcome",
            content: `Hello! I'm your AI assistant for "${blogTitle}". How can I help you understand this article better?`,
            role: "assistant",
            timestamp: new Date(),
          },
        ]);

        toast({
          title: "Chat cleared",
          description: "Your conversation has been cleared.",
        });
      } catch (error) {
        console.error("Failed to clear chat:", error);
        toast({
          title: "Error clearing chat",
          description: "Failed to clear your conversation history.",
          variant: "destructive",
        });
      }
    }
  };

  // Function to provide feedback
  const provideFeedback = (messageId: string, isPositive: boolean) => {
    // In a real app, send this feedback to your server
    toast({
      title: isPositive ? "Positive feedback sent" : "Negative feedback sent",
      description: "Thank you for your feedback!",
    });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-5 md:right-10 w-[90vw] max-w-md h-[600px] max-h-[70vh] z-50"
          >
            <Card className="h-full flex flex-col overflow-hidden border border-purple-200/30 dark:border-purple-900/30 shadow-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm rounded-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900 p-4 flex flex-row justify-between items-center">
                <div className="flex items-center space-x-2 text-white">
                  <div className="flex flex-col w-full text-white">
                    {/* Top row: Bot icon, title, and badge */}
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <span className="relative mr-2">
                          <Bot className="h-5 w-5" />
                          <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                        </span>
                        <h3 className="font-medium">Article Discussion</h3>
                        <Badge
                          variant="outline"
                          className="ml-2 text-[10px] border-white/30 text-white/80"
                        >
                          Gemini
                        </Badge>
                      </div>
                    </div>

                    {/* Bottom row: Messages count and chat limits */}
                    <div className="flex items-center justify-between text-xs">
                      <p className="text-purple-200">
                        {messages.length > 1
                          ? `${messages.length - 1} messages`
                          : "Start a conversation"}
                      </p>

                      {remainingChats !== null && (
                        <div className="flex items-center text-purple-200 shrink-0">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className="whitespace-nowrap">
                            {remainingChats}/{MAX_DAILY_CHATS}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setRedeemDialogOpen(true)}
                            className="ml-1 h-5 w-5 rounded-full hover:bg-purple-600/50 text-purple-200"
                          >
                            <Gift className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
              

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={clearChat}
                          className="text-white hover:bg-purple-700/50 dark:hover:bg-purple-700/50 rounded-full h-7 w-7"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        Clear conversation
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleChat}
                    className="text-white hover:bg-purple-700/50 dark:hover:bg-purple-700/50 rounded-full h-7 w-7"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-400 dark:text-gray-500">
                    <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
                    <p>Loading conversation...</p>
                  </div>
                )}

                {messages.map((message, index) => {
                  const isFirstInGroup =
                    index === 0 || messages[index - 1].role !== message.role;
                  const showAvatar = isFirstInGroup;

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} group`}
                    >
                      <div
                        className={`flex items-start max-w-[85%] group ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        {showAvatar ? (
                          <div
                            className={`mt-1 ${message.role === "user" ? "ml-2" : "mr-2"} flex-shrink-0`}
                          >
                            {message.role === "assistant" ? (
                              <Avatar className="h-8 w-8 ring-2 ring-purple-100 dark:ring-purple-900 bg-white dark:bg-zinc-800">
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center">
                                  <Sparkles className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <Avatar className="h-8 w-8 ring-2 ring-purple-100 dark:ring-purple-900 bg-white dark:bg-zinc-800">
                                <AvatarImage
                                  src={session?.user?.image || ""}
                                  alt={session?.user?.name || "User"}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-700 text-white">
                                  {session?.user?.name?.[0] || "U"}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        ) : (
                          <div
                            className={`w-10 flex-shrink-0 ${message.role === "user" ? "ml-2" : "mr-2"}`}
                          ></div>
                        )}

                        <div
                          className={cn(
                            "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                            message.role === "user"
                              ? "bg-gradient-to-br my-4 from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 text-purple-900 dark:text-purple-100 rounded-tr-none"
                              : "bg-white dark:bg-zinc-800/70 border border-gray-100 dark:border-zinc-700/50 text-gray-800 dark:text-zinc-100 rounded-tl-none",
                            message.isFavorite &&
                              "ring-2 ring-yellow-400 dark:ring-yellow-500/50"
                          )}
                        >
                          {renderMessageContent(message.content, message.role)}
                          <div className="text-[10px] mt-1.5 flex justify-between items-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5 text-gray-400">
                              {message.role === "assistant" && (
                                <>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(message.content)
                                    }
                                    className="hover:text-purple-600 dark:hover:text-purple-400"
                                    aria-label="Copy to clipboard"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </button>

                                  <button
                                    onClick={() =>
                                      speakMessage(message.content)
                                    }
                                    className={cn(
                                      "hover:text-purple-600 dark:hover:text-purple-400",
                                      isSpeaking &&
                                        "text-purple-600 dark:text-purple-400"
                                    )}
                                    aria-label="Read aloud"
                                  >
                                    <Volume2 className="h-3 w-3" />
                                  </button>

                                  <button
                                    onClick={() => toggleFavorite(message.id)}
                                    className={cn(
                                      "hover:text-yellow-500",
                                      message.isFavorite && "text-yellow-500"
                                    )}
                                    aria-label="Mark as favorite"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="w-3 h-3"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>

                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <button
                                        className="hover:text-purple-600 dark:hover:text-purple-400"
                                        aria-label="More options"
                                      >
                                        <Share2 className="h-3 w-3" />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="start"
                                      className="w-36"
                                    >
                                      <DropdownMenuItem
                                        onClick={() =>
                                          provideFeedback(message.id, true)
                                        }
                                      >
                                        <ThumbsUp className="h-3 w-3 mr-2" />
                                        <span>Helpful</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          provideFeedback(message.id, false)
                                        }
                                      >
                                        <ThumbsDown className="h-3 w-3 mr-2" />
                                        <span>Not helpful</span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </>
                              )}
                            </div>
                            <div className="opacity-50 text-right ml-auto">
                              {formatTimestamp(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start max-w-[80%]">
                      <Avatar className="h-8 w-8 mr-2 mt-1 ring-2 ring-purple-100 dark:ring-purple-900 bg-white dark:bg-zinc-800">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                          <Sparkles className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white dark:bg-zinc-800/70 border border-gray-100 dark:border-zinc-700/50 p-3 rounded-2xl rounded-tl-none shadow-sm">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-purple-400 dark:bg-purple-600 animate-pulse" />
                          <div
                            className="w-2 h-2 rounded-full bg-purple-400 dark:bg-purple-600 animate-pulse"
                            style={{ animationDelay: "0.2s" }}
                          />
                          <div
                            className="w-2 h-2 rounded-full bg-purple-400 dark:bg-purple-600 animate-pulse"
                            style={{ animationDelay: "0.4s" }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>
              <CardFooter className="p-3 bg-gray-50 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-zinc-800">
                <form
                  onSubmit={handleSendMessage}
                  className="flex gap-2 w-full"
                >
                  <div className="relative flex-1">
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Ask about this article..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      disabled={isLoading}
                      className="pr-10 flex-1 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 focus-visible:ring-purple-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (inputMessage.trim()) {
                            handleSendMessage();
                          }
                        }
                      }}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <CornerDownLeft className="h-3.5 w-3.5 opacity-50" />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="fixed bottom-5 right-5 md:right-10 z-50" // Added fixed positioning to the container
            >
              <Button
                onClick={toggleChat}
                className={cn(
                  "rounded-full p-3 shadow-lg transition-all duration-300",
                  isOpen
                    ? "bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-800 hover:to-purple-900"
                    : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800",
                  !isOpen && status !== "authenticated" && "animate-pulse",
                  "shadow-purple-500/20"
                )}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-white" />
                  ) : (
                    <MessageSquare className="h-5 w-5 text-white" />
                  )}
                </motion.div>
                {!isOpen && (
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-white dark:ring-zinc-900"
                  />
                )}
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
          >
            {isOpen ? "Minimize chat" : "Discuss this article with AI"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={redeemDialogOpen} onOpenChange={setRedeemDialogOpen}>
        <DialogContent className="sm:max-w-md dark:bg-neutral-900 bg-neutral-50 border-none">
          <DialogHeader>
            <DialogTitle>
              {remainingChats === 0
                ? "Chat limit reached"
                : "Redeem a code for more chats"}
            </DialogTitle>
            <DialogDescription>
              {remainingChats === 0
                ? "You've reached your daily limit of 15 chats. Enter a redeem code to continue chatting."
                : "Enter your code to unlock additional daily chat messages."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="redeem-code">Redeem Code</Label>
              <div className="flex gap-2">
                <Input
                  id="redeem-code"
                  placeholder="Enter your code"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleRedeemCode}
                  disabled={!redeemCode.trim() || isRedeeming}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                >
                  {isRedeeming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Redeem"
                  )}
                </Button>
              </div>
            </div>

            <div className="text-sm text-gray-500 border-t pt-2 dark:text-gray-400">
              <p>
                Need more chats? Redeem codes can be found in our newsletter or
                by supporting this blog.
              </p>
            </div>
          </div>

          <DialogFooter className="sm:justify-start">
            <Button
              variant="outline"
              onClick={() => setRedeemDialogOpen(false)}
            >
              Close
            </Button>
            {remainingChats === 0 && (
              <div className="ml-auto text-xs text-gray-500">
                Limits reset at midnight UTC
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
