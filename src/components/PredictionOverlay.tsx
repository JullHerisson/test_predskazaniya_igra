import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { X, Download, Mail, Share2 } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface PredictionOverlayProps {
  prediction: string;
  tier: string;
  onClose: () => void;
}

export const PredictionOverlay = ({ prediction, tier, onClose }: PredictionOverlayProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Сообщаем родителю (Тильде), что открыт оверлей — центрируем iframe и блокируем скролл страницы
  useEffect(() => {
    if (inline) return; // В inline-режиме не шлём сообщения и не проксируем скролл
    try {
      window.parent?.postMessage({ type: 'APP_OVERLAY_OPEN' }, '*');
    } catch {}

    // Проксируем скролл в родителя, чтобы на Тильде страница под попапом скроллилась
    const handleWheel = (e: WheelEvent) => {
      try {
        window.parent?.postMessage({ type: 'APP_SCROLL_DELTA', deltaY: e.deltaY }, '*');
      } catch {}
    };
    let lastY = 0;
    const handleTouchMove = (e: TouchEvent) => {
      const y = e.touches && e.touches[0] ? e.touches[0].clientY : 0;
      if (!lastY) { lastY = y; return; }
      const deltaY = lastY - y;
      lastY = y;
      try {
        window.parent?.postMessage({ type: 'APP_SCROLL_DELTA', deltaY }, '*');
      } catch {}
    };

    const target: EventTarget = (overlayRef.current as unknown as EventTarget) || window;
    target.addEventListener('wheel', handleWheel as EventListener, { passive: true } as AddEventListenerOptions);
    target.addEventListener('touchmove', handleTouchMove as EventListener, { passive: true } as AddEventListenerOptions);

    return () => {
      try {
        window.parent?.postMessage({ type: 'APP_OVERLAY_CLOSE' }, '*');
      } catch {}
      target.removeEventListener('wheel', handleWheel as EventListener);
      target.removeEventListener('touchmove', handleTouchMove as EventListener);
    };
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = 'prediction.png';
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success("Предсказание сохранено!");
    } catch (error) {
      toast.error("Не удалось сохранить изображение");
    }
  };

  const handleEmail = () => {
    const email = prompt("Введите ваш email:");
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.success("Отправлено!");
    } else if (email) {
      toast.error("Неверный формат email");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Моё новогоднее предсказание',
          text: prediction,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      toast.info("Поделиться через браузер не поддерживается");
    }
  };

  // удалён inline-режим (откат)

  const overlay = (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        pointerEvents: 'none'
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 text-foreground hover:bg-foreground/10 z-10"
        style={{ pointerEvents: 'auto' }}
      >
        <X className="h-6 w-6" />
      </Button>

      <div className="max-w-lg w-full space-y-4 sm:space-y-6" style={{ maxHeight: 'min(88vh, 100%)', pointerEvents: 'auto' }}>
        <div
          ref={cardRef}
          className="relative bg-card/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-12 border-2 border-accent/40 shadow-2xl"
          style={{ maxHeight: 'inherit', overflow: 'auto' }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
          
          <div className="space-y-6 sm:space-y-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-muted-foreground">
              Твоё новогоднее предсказание
            </h2>
            
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold leading-relaxed text-foreground">
              {prediction}
            </p>

            <div className="pt-4 text-xs sm:text-sm text-muted-foreground">
              <p>Фонд «Игра» • Детство не ждёт</p>
            </div>
          </div>

          {/* Decorative snowflakes */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-accent/20 text-xl sm:text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              ❄
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          <Button
            onClick={handleDownload}
            className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm sm:text-base"
          >
            <Download className="mr-2 h-4 w-4" />
            Сохранить
          </Button>
          
          <Button
            onClick={handleEmail}
            variant="outline"
            className="border-2 border-accent/50 hover:bg-accent/10 text-sm sm:text-base"
          >
            <Mail className="mr-2 h-4 w-4" />
            Отправить на почту
          </Button>
          
          <Button
            onClick={handleShare}
            variant="outline"
            className="border-2 border-accent/50 hover:bg-accent/10 text-sm sm:text-base"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Поделиться
          </Button>
        </div>

        {tier === "giant-triple" && (
          <div className="text-center text-accent font-semibold animate-pulse text-sm sm:text-base">
            У вас 3 предсказания! (демо: показано 1)
          </div>
        )}
      </div>
    </div>
  );

  // В iOS/Safari и в Tilda фиксированные элементы внутри трансформированных контейнеров могут позиционироваться
  // относительно предка. Переносим оверлей в document.body через портал, чтобы всегда центрировать по вьюпорту.
  if (typeof document !== 'undefined') {
    return createPortal(overlay, document.body);
  }
  return overlay;
};
