import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="py-8 sm:py-16 px-4 border-t border-border bg-card/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Фонд «Игра»</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              Благотворительная акция. Все собранные средства пойдут на помощь детям с двигательными нарушениями.
            </p>
            <Button 
              variant="outline"
              className="border-2 border-accent hover:bg-accent hover:text-accent-foreground text-sm sm:text-base w-full sm:w-auto"
            >
              Узнать больше о фонде
            </Button>
          </div>
          
          <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
            <p><strong>ИНН:</strong> ХХХХХХХХХХ</p>
            <p><strong>ОГРН:</strong> ХХХХХХХХХХХХХХ</p>
            <p><strong>Адрес:</strong> г. Москва, ул. Примерная, д. 1</p>
            <p><strong>Email:</strong> info@fondgame.ru</p>
            <p><strong>Телефон:</strong> +7 (XXX) XXX-XX-XX</p>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-border text-center text-xs sm:text-sm text-muted-foreground">
          <p>© 2025 Фонд «Игра». Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};
