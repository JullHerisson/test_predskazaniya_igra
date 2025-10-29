import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

export const PaymentModal = ({ isOpen, onClose, onSuccess }: PaymentModalProps) => {
  const [amount, setAmount] = useState("500");

  const handlePayment = () => {
    const parsedAmount = parseInt(amount);
    
    if (isNaN(parsedAmount) || parsedAmount < 100) {
      toast.error("Минимальная сумма доната — 100 ₽");
      return;
    }

    // Simulate payment success
    toast.success("Платёж успешен! Автомат заработал...");
    onSuccess(parsedAmount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogHeader>
            Опустите монетку, чтобы автомат заработал
          </DialogDescription>
        </DialogHeader>
        
          <div className="space-y-2">
            <Label htmlFor="amount">Сумма доната (₽)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-muted-foreground bg-muted/30 p-3 sm:p-4 rounded-lg max-h-[200px] overflow-y-auto">
            <p className="font-semibold text-foreground">Уровни доната:</p>
            <ul className="space-y-1">
              <li>• до 200 ₽ — обычная клешня</li>
              <li>• 200–500 ₽ — золотая клешня</li>
              <li>• 500–1000 ₽ — гигантская клешня</li>
              <li>• от 1000 ₽ — 3 гигантских клешни (3 предсказания!)</li>
            </ul>
          </div>

          <div className="bg-muted/50 p-3 sm:p-4 rounded-lg border border-border mt-4">
            <p className="text-xs sm:text-sm text-center text-muted-foreground mb-3">
              В реальной версии здесь будет виджет CloudPayments
            </p>
            <Button
              onClick={handlePayment}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base sm:text-lg py-5 sm:py-6"
            >
              Оплатить {amount} ₽
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
