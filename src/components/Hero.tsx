import { Button } from "@/components/ui/button";
import { ClawMachine } from "./ClawMachine";

interface HeroProps {
  onDonateClick: () => void;
  isAnimating: boolean;
  donationAmount?: number;
}

export const Hero = ({ onDonateClick, isAnimating, donationAmount = 0 }: HeroProps) => {
  const scrollToInfo = () => {
    const infoSection = document.getElementById("info-section");
    infoSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="flex flex-col items-center justify-start px-4 pt-4 sm:pt-8 pb-6 sm:pb-12 relative">
      <div className="max-w-6xl w-full mx-auto text-center space-y-4 sm:space-y-8">
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
            Детство не ждёт
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
            Жизнь детей с двигательными нарушениями похожа на новогодний стол с запретными угощениями — 
            всё красиво и близко, но недоступно. Их детство проходит в ожидании. 
            Фонд «Игра» превращает благотворительность в игру: наруши запрет, получи персональное 
            предсказание и помоги детям перестать жить в режиме паузы.
          </p>
        </div>

        <ClawMachine isAnimating={isAnimating} donationAmount={donationAmount} />

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 sm:pt-8">
          <Button 
            size="lg"
            onClick={onDonateClick}
            disabled={isAnimating}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            не ждать
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            onClick={scrollToInfo}
            className="border-2 border-foreground/20 hover:border-foreground/40 bg-transparent hover:bg-foreground/5 text-foreground font-semibold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl transition-all duration-300 w-full sm:w-auto"
          >
            подождать
          </Button>
        </div>
      </div>
    </section>
  );
};
