import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { InfoSection } from "@/components/InfoSection";
import { Footer } from "@/components/Footer";
import { Snowfall } from "@/components/Snowfall";
import { PaymentModal } from "@/components/PaymentModal";
import { PredictionOverlay } from "@/components/PredictionOverlay";

export interface Prediction {
  text: string;
  tier: string;
}

const Index = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [donationAmount, setDonationAmount] = useState(0);

  const handleDonateClick = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = (amount: number) => {
    setShowPayment(false);
    setDonationAmount(amount);
    
    // Scroll to machine to show animation
    setTimeout(() => {
      const machineElement = document.querySelector('[data-claw-machine]') || 
                            document.querySelector('.relative.w-full.max-w-2xl');
      if (machineElement) {
        machineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // Дополнительно просим родителя (Тильду) прокрутить iframe к центру экрана
      try {
        window.parent?.postMessage({ type: 'APP_SCROLL_TO_MACHINE' }, '*');
      } catch {}
    }, 100);
    
    setIsAnimating(true);
    
    // Show prediction when claw reaches the top with the ball
    // Total time: approach(1s) + pause(1.2s) + descend(2s) + open(0.5s) + close(0.3s) + grab(0.4s) + ascend(1s) = ~6.4s
    setTimeout(() => {
      const predictions = [
        "Ты найдёшь то, что давно ищешь",
        "Год принесёт тёплые перемены",
        "Смелый шаг откроет важную дверь",
        "Твоя мечта уже близко",
        "Ты обнимешь того, кто нужен сердцу",
        "Маленькое чудо придёт внезапно",
        "Новая дружба согреет зиму",
        "Там, где сложно, ты справишься",
        "Время заметит твои старания",
        "Добрая весть придёт до снега",
        "Случайная встреча всё изменит к лучшему",
        "Тепло дома умножится",
        "Ты услышишь ответ, который ждал(а)",
        "Появится занятие, что радует каждый день",
        "Верь в себя — и получится",
        "Ты окажешься в нужном месте вовремя",
        "Старый план наконец сработает",
        "Будут силы начать сначала",
        "Кто-то скажет тебе важные слова",
        "Улыбка вернёт лёгкость"
      ];

      let tier = "silver";
      if (amount >= 1000) tier = "giant-triple";
      else if (amount >= 500) tier = "giant";
      else if (amount >= 200) tier = "gold";

      const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
      
      setPrediction({ text: randomPrediction, tier });
      setIsAnimating(false);
    }, 6400); // Wait for full claw animation: approach + pause + descend + open + close + grab + ascend
  };

  const handleClosePrediction = () => {
    setPrediction(null);
  };

  // Post height to parent (Tilda) so the iframe auto-resizes to our content
  useEffect(() => {
    const postHeight = () => {
      try {
        // Упрощенный и более надежный расчет высоты
        const body = document.body;
        const html = document.documentElement;
        
        // Используем самую точную высоту контента
        const height = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );
        
        // Информируем родительскую страницу (Tilda) об изменении высоты
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ 
            type: 'APP_IFRAME_HEIGHT', 
            height: height 
          }, '*');
          
          // Дополнительно отправляем в консоль для отладки (можно убрать потом)
          if (process.env.NODE_ENV === 'development') {
            console.log('Sent height to parent:', height);
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error posting height:', err);
        }
      }
    };

    // Отправляем высоту сразу и с задержками для надежности
    postHeight();
    const timeout1 = setTimeout(postHeight, 100);
    const timeout2 = setTimeout(postHeight, 500);
    const timeout3 = setTimeout(postHeight, 1000);
    
    const ro = new ResizeObserver(() => {
      postHeight();
    });
    ro.observe(document.body);
    
    window.addEventListener('load', postHeight);
    window.addEventListener('resize', postHeight);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      ro.disconnect();
      window.removeEventListener('load', postHeight);
      window.removeEventListener('resize', postHeight);
    };
  }, [showPayment, prediction, isAnimating]);

  const isEmbedded = typeof window !== 'undefined' && window.parent && window.parent !== window;

  return (
    <div className="bg-background text-foreground relative overflow-hidden" style={{ isolation: 'isolate', contain: 'layout style paint' }}>
      <Snowfall />
      
      <Hero 
        onDonateClick={handleDonateClick}
        isAnimating={isAnimating}
        donationAmount={donationAmount}
      />
      
      <InfoSection />
      
      <Footer />

      <PaymentModal 
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />

      {prediction && (
        <PredictionOverlay 
          prediction={prediction.text}
          tier={prediction.tier}
          onClose={handleClosePrediction}
          inline={isEmbedded}
        />
      )}
    </div>
  );
};

export default Index;
