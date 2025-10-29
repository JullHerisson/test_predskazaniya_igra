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
    <section className="min-h-screen flex flex-col items-center justify-start px-4 pt-8 pb-12 relative">
      <div className="max-w-6xl w-full mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Детство не ждёт
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Жизнь детей с двигательными нарушениями похожа на новогодний стол с запретными угощениями — 
            всё красиво и близко, но недоступно. Их детство проходит в ожидании. 
            Фонд «Игра» превращает благотворительность в игру: наруши запрет, получи персональное 
            предсказание и помоги детям перестать жить в режиме паузы.
          </p>
        </div>

        <ClawMachine isAnimating={isAnimating} donationAmount={donationAmount} />

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button 
            size="lg"
            onClick={onDonateClick}
            disabled={isAnimating}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            не ждать
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            onClick={scrollToInfo}
            className="border-2 border-foreground/20 hover:border-foreground/40 bg-transparent hover:bg-foreground/5 text-foreground font-semibold text-lg px-8 py-6 rounded-xl transition-all duration-300"
          >
            подождать
          </Button>
        </div>
      </div>
    </section>
  );
};
