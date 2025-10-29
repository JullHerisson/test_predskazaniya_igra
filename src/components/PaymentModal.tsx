import { useState, useEffect, useRef } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Заглушка publicId — замените на реальный ключ CloudPayments
  const CLOUDPAYMENTS_PUBLIC_ID = 'pk_test_placeholder_replace_me';

  // На случай если скрипт не успел подгрузиться — догружаем динамически
  const ensureCloudPayments = async (): Promise<boolean> => {
    // @ts-ignore
    if (window.CloudPayments) return true;
    return new Promise<boolean>((resolve) => {
      const existing = document.querySelector('script[src*="cloudpayments.js"]') as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => resolve(true));
        existing.addEventListener('error', () => resolve(false));
        return;
      }
      const s = document.createElement('script');
      s.src = 'https://widget.cloudpayments.ru/bundles/cloudpayments.js';
      s.async = true;
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });
  };

  // Allow body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Don't prevent body scroll - allow scrolling behind modal
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Сообщаем родителю (Тильде), когда открывается/закрывается попап оплаты —
  // чтобы центрировать iframe относительно экрана и по желанию блокировать скролл страницы
  useEffect(() => {
    try {
      if (isOpen) {
        window.parent?.postMessage({ type: 'APP_OVERLAY_OPEN' }, '*');
      } else {
        window.parent?.postMessage({ type: 'APP_OVERLAY_CLOSE' }, '*');
      }
    } catch {}
  }, [isOpen]);

  const handlePayment = async () => {
    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount) || parsedAmount < 100) {
      toast.error("Минимальная сумма доната — 100 ₽");
      return;
    }

    const ready = await ensureCloudPayments();
    if (!ready) {
      toast.error('Не удалось загрузить виджет оплаты');
      return;
    }

    // @ts-ignore
    const cp = new window.CloudPayments();
    cp.pay('charge', {
      publicId: CLOUDPAYMENTS_PUBLIC_ID,
      amount: parsedAmount,
      currency: 'RUB',
      description: 'Пожертвование Фонд «Игра»',
      skin: 'mini',
      accountId: 'anon',
      email: undefined,
    }, {
      onSuccess: () => {
        try {
          const audio = new Audio('/slot-machine-insert-quarter0.mp3');
          audio.play().catch(() => {});
        } catch {}
        toast.success('Платёж успешен! Автомат заработал…');
        onSuccess(parsedAmount);
      },
      onFail: (reason: unknown) => {
        toast.error('Платёж не прошёл' + (reason ? `: ${String(reason)}` : ''));
      },
      onComplete: () => {}
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-md border-2 border-accent/40 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">Опустите монетку</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Опустите монетку, чтобы автомат заработал
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4 pb-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Сумма доната (₽)</Label>
            <Input
              id="amount"
              ref={inputRef}
              type="number"
              placeholder="500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
              autoFocus={false}
              inputMode="numeric"
              readOnly={false}
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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base sm:text-lg py-5 sm:py-6 shadow-lg"
            >
              Оплатить {amount} ₽
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
