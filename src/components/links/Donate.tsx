"use client";

import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  CreditCard,
  Bitcoin,
  Heart,
  Target,
  Smartphone,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const predefinedAmounts = [5, 10, 25, 50, 100];
const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
  { code: "INR", symbol: "₹" },
];

export function DonationSection() {
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donationMethod, setDonationMethod] = useState("paypal");
  const [progress, setProgress] = useState(0);
  const [currency, setCurrency] = useState(currencies[0]);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setProgress(65), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/USD`
        );
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
        toast({
          title: "Error",
          description:
            "Failed to fetch exchange rates. Please try again later.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };

    fetchExchangeRates();
  }, [toast]);

  useEffect(() => {
    if (currency.code !== "INR" && donationMethod === "upi") {
      setDonationMethod("paypal");
    }
  }, [currency, donationMethod]);

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      setAmount("");
      return;
    }
    setAmount(value);
  };

  const handleDonateClick = () => {
    const minAmount = 1;
    if (parseFloat(amount) < minAmount) {
      toast({
        title: "Invalid amount",
        description: `Please enter an amount of ${currency.symbol}1 or more.`,
        variant: "destructive",
      });
      return;
    }
    setIsModalOpen(true);
  };

  const handleDonate = async () => {
    setIsModalOpen(false);
    const donatedAmount = `${currency.symbol}${amount}`;
    toast({
      title: "Thank you for your donation!",
      description: `You've donated ${donatedAmount} via ${donationMethod}.`,
      duration: 5000,
    });
    setAmount("");
    setProgress((prev) => Math.min(prev + 5, 100));
  };

  const getDisplayAmount = () => {
    if (!amount) return "";
    return `${currency.symbol}${amount}`;
  };

  const convertAmount = (
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ) => {
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency])
      return amount;
    return (amount / exchangeRates[fromCurrency]) * exchangeRates[toCurrency];
  };

  const paymentMethods = [
    { value: "paypal", icon: DollarSign, label: "PayPal" },
    { value: "stripe", icon: CreditCard, label: "Credit Card (Stripe)" },
    { value: "crypto", icon: Bitcoin, label: "Cryptocurrency" },
    {
      value: "upi",
      icon: Smartphone,
      label: "UPI (INR)",
      disabledWhen: (curr: string) => curr !== "INR",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-neutral-100/90 dark:bg-neutral-900/90 p-8 my-16 rounded-3xl dark:shadow-lg backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 max-w-xl mx-auto"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-neutral-900 dark:text-neutral-100 text-center"
      >
        Support My Work
      </motion.h2>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col items-center space-y-4"
        >
          <p className="text-neutral-600 dark:text-neutral-400 text-center text-sm flex items-center">
            <Target className="w-4 hidden sm:block h-4 mr-2" />
            Help me reach my goal of $10,000
          </p>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-6 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
              className="bg-gradient-to-r from-neutral-400 to-neutral-600 dark:from-neutral-600 dark:to-neutral-400 h-full rounded-full flex items-center justify-end pr-2"
            >
              <span className="text-xs font-semibold text-white">
                {progress}%
              </span>
            </motion.div>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            ${((progress / 100) * 10000).toFixed(2)} raised of $10,000 goal
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          {predefinedAmounts.map((presetAmount, index) => (
            <motion.div
              key={presetAmount}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
            >
              <Button
                onClick={() =>
                  handleAmountChange(
                    convertAmount(presetAmount, "USD", currency.code).toFixed(2)
                  )
                }
                variant={
                  amount ===
                  convertAmount(presetAmount, "USD", currency.code).toFixed(2)
                    ? "outline"
                    : "outline"
                }
                size="sm"
                className="rounded-full px-5 py-2 text-sm transition-all duration-300"
              >
                {currency.symbol}
                {convertAmount(presetAmount, "USD", currency.code).toFixed(2)}
              </Button>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex gap-4"
        >
          <div className="relative flex-grow">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 w-5 h-5" />
            <Input
              type="number"
              placeholder="Custom amount"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="pl-10 rounded-xl h-12 border-neutral-300 dark:border-neutral-700 text-lg w-full"
              min="1"
              step="0.01"
            />
          </div>
          <Select
            value={currency.code}
            onValueChange={(value) =>
              setCurrency(
                currencies.find((c) => c.code === value) || currencies[0]
              )
            }
          >
            <SelectTrigger className="w-[120px] border-neutral-300 dark:border-neutral-700 h-12 rounded-xl">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg">
              {currencies.map((c) => (
                <SelectItem
                  key={c.code}
                  value={c.code}
                  className="text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors duration-200"
                >
                  {c.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Button
            onClick={handleDonateClick}
            className={cn(
              "w-full bg-gradient-to-r from-neutral-700 to-neutral-900 hover:from-neutral-800 hover:to-neutral-950 text-white dark:from-neutral-200 dark:to-neutral-400 dark:text-neutral-900 dark:hover:from-neutral-300 dark:hover:to-neutral-500 rounded-xl h-12 text-lg font-semibold transition-all duration-300",
              (!amount || isLoading) && "opacity-50 cursor-not-allowed"
            )}
            disabled={!amount || isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Heart className="w-5 h-5 mr-2" /> Donate Now
              </>
            )}
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center text-sm text-neutral-500 dark:text-neutral-400"
        >
          Your support helps me continue creating valuable content and
          resources.
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[425px] rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  Choose Payment Method
                </DialogTitle>
                <DialogDescription className="text-neutral-600 dark:text-neutral-400">
                  Select how you&apos;d like to donate {getDisplayAmount()}.
                </DialogDescription>
              </DialogHeader>
              <RadioGroup
                value={donationMethod}
                onValueChange={setDonationMethod}
                className="grid gap-4 mt-6"
              >
                {paymentMethods.map((method, index) => (
                  <motion.div
                    key={method.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <Label
                      htmlFor={method.value}
                      className={cn(
                        "flex items-center space-x-3 border border-neutral-300 dark:border-neutral-700 p-4 rounded-xl cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors duration-200",
                        method.disabledWhen &&
                          method.disabledWhen(currency.code) &&
                          "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <RadioGroupItem
                        value={method.value}
                        id={method.value}
                        disabled={
                          method.disabledWhen &&
                          method.disabledWhen(currency.code)
                        }
                      />
                      <method.icon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                      <span className="text-neutral-900 dark:text-neutral-100 text-lg">
                        {method.label}
                      </span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
              <DialogFooter>
                <motion.div
                  className="w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleDonate}
                    className="w-full mt-6 bg-gradient-to-r from-neutral-700 to-neutral-900 hover:from-neutral-800 hover:to-neutral-950 text-white dark:from-neutral-200 dark:to-neutral-400 dark:text-neutral-900 dark:hover:from-neutral-300 dark:hover:to-neutral-500 rounded-xl h-12 text-lg font-semibold transition-all duration-300"
                  >
                    Complete {getDisplayAmount()} Donation
                  </Button>
                </motion.div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
