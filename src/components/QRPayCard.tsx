import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ScanLine, Copy, Check, Share2, Loader2, CheckCircle2, Users, ArrowLeft, Dice5 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFinance } from "@/context/FinanceContext";
import { mockContacts } from "@/data/contacts";
import { Contact } from "@/types/finance";
import { toast } from "sonner";

type ViewMode = "receive" | "send";
type Step = "select-contact" | "qr" | "processing" | "success";

export function QRPayCard() {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("receive");
  const [step, setStep] = useState<Step>("qr");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [txnId, setTxnId] = useState("");
  const [txnDate, setTxnDate] = useState("");
  const { addTransaction } = useFinance();

  const myUpiId = "yourname@finflow";

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedContact?.upiId || myUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setExpanded(false);
    setTimeout(() => {
      setStep("qr");
      setViewMode("receive");
      setSelectedContact(null);
      setAmount("");
      setError("");
    }, 300);
  };

  const handleRandomAmount = () => {
    const val = (Math.random() * 200 + 1).toFixed(2);
    setAmount(val);
    setError("");
  };

  const handlePay = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      setError("Enter a valid amount greater than 0");
      return;
    }
    setError("");
    setStep("processing");

    const id = `TXN${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const now = new Date();

    setTimeout(() => {
      setTxnId(id);
      setTxnDate(now.toLocaleString());
      addTransaction({
        date: now.toISOString().split("T")[0],
        amount: val,
        category: "UPI Payment",
        type: "expense",
        description: `Payment to ${selectedContact?.name || myUpiId}`,
      });
      toast.success("Payment processed and added to history!");
      setStep("success");
    }, 2000);
  };

  const startSendMode = () => {
    setViewMode("send");
    setStep("select-contact");
  };

  const selectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setStep("qr");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-5 cursor-pointer group"
        onClick={() => setExpanded(true)}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <ScanLine className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground font-display">Scan & Pay</p>
            <p className="text-xs text-muted-foreground mt-0.5">Tap to pay or receive</p>
          </div>
          <div className="flex -space-x-2">
            {mockContacts.slice(0, 3).map((c) => (
              <div key={c.id} className={`w-8 h-8 rounded-full border-2 border-background ${c.color} flex items-center justify-center text-[10px] text-white font-bold`}>
                {c.name.charAt(0)}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-md p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="gradient-primary px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {step === "select-contact" || (viewMode === "send" && step === "qr") ? (
                    <button onClick={() => step === "qr" ? setStep("select-contact") : setViewMode("receive")} className="bg-white/20 p-1.5 rounded-full text-white">
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  ) : null}
                  <div>
                    <p className="text-primary-foreground/80 text-xs font-medium uppercase tracking-wider">
                      {step === "success" ? "Payment Complete" : step === "processing" ? "Processing" : step === "select-contact" ? "Choose Contact" : viewMode === "receive" ? "Receive Money" : "Send Money"}
                    </p>
                    <p className="text-primary-foreground font-display font-bold text-lg mt-0.5">
                      {step === "success" ? "Success!" : step === "processing" ? "Please wait..." : step === "select-contact" ? "Contacts" : viewMode === "receive" ? "My QR Code" : `Pay ${selectedContact?.name}`}
                    </p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleClose}
                  className="text-primary-foreground hover:bg-primary-foreground/20 h-9 w-9"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <AnimatePresence mode="wait">
                {step === "select-contact" && (
                  <motion.div
                    key="contacts"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="px-6 py-6"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      {mockContacts.map((contact) => (
                        <button
                          key={contact.id}
                          onClick={() => selectContact(contact)}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className={`w-14 h-14 rounded-2xl ${contact.color} shadow-sm flex items-center justify-center text-white text-xl font-bold group-hover:scale-105 transition-transform`}>
                            {contact.name.charAt(0)}
                          </div>
                          <span className="text-xs font-medium text-foreground text-center truncate w-full">{contact.name.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === "qr" && (
                  <motion.div
                    key="qr-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="px-6 py-6 flex flex-col items-center"
                  >
                    {viewMode === "receive" ? (
                      <>
                        <div className="bg-card p-4 rounded-2xl border-2 border-border shadow-sm relative mb-6">
                           <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                          <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                          <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-primary rounded-br-lg" />
                          <QRCodeSVG value={myUpiId} size={160} bgColor="transparent" fgColor="hsl(var(--foreground))" level="H" />
                        </div>
                        <Button onClick={startSendMode} variant="outline" className="w-full border-primary/20 hover:border-primary hover:bg-primary/5 gap-2 h-11">
                          <Users className="h-4 w-4 text-primary" />
                          Pay a Contact
                        </Button>
                      </>
                    ) : (
                      <div className="w-full space-y-6">
                        <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-2xl border border-border">
                          <div className={`w-12 h-12 rounded-xl ${selectedContact?.color} flex items-center justify-center text-white font-bold`}>
                            {selectedContact?.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{selectedContact?.name}</p>
                            <p className="text-xs text-muted-foreground">{selectedContact?.upiId}</p>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Enter Amount</label>
                            <button onClick={handleRandomAmount} className="flex items-center gap-1 text-[10px] text-primary hover:underline font-medium">
                              <Dice5 className="h-3 w-3" />
                              Random
                            </button>
                          </div>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={amount}
                              onChange={e => { setAmount(e.target.value); setError(""); }}
                              className="pl-7 text-lg font-display font-semibold h-12"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
                        </div>

                        <Button onClick={handlePay} className="w-full gradient-primary text-primary-foreground border-0 h-11 font-semibold text-base shadow-lg shadow-primary/20">
                          Confirm & Pay
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}

                {step === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="px-6 py-16 flex flex-col items-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Loader2 className="h-12 w-12 text-primary" />
                    </motion.div>
                    <p className="text-foreground font-display font-semibold text-lg mt-4">Processing Payment</p>
                    <p className="text-muted-foreground text-sm mt-1">Paying {selectedContact?.name}...</p>
                    <p className="text-primary font-display font-bold text-2xl mt-3">${parseFloat(amount).toFixed(2)}</p>
                  </motion.div>
                )}

                {step === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="px-6 py-8 flex flex-col items-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                      className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                    >
                      <CheckCircle2 className="h-10 w-10 text-primary" />
                    </motion.div>

                    <p className="text-foreground font-display font-bold text-xl mt-4">Payment Successful!</p>
                    <p className="text-primary font-display font-bold text-3xl mt-2">${parseFloat(amount).toFixed(2)}</p>

                    <div className="w-full mt-6 space-y-2 bg-muted/50 rounded-xl p-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">To</span>
                        <span className="text-foreground font-medium">{selectedContact?.name || myUpiId}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Transaction ID</span>
                        <span className="text-foreground font-medium font-mono text-xs">{txnId}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date & Time</span>
                        <span className="text-foreground font-medium text-xs">{txnDate}</span>
                      </div>
                    </div>

                    <Button onClick={handleClose} className="w-full mt-6 gradient-primary text-primary-foreground border-0 h-11 font-semibold">
                      Done
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
