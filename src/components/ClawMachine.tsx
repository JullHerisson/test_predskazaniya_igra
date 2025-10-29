import { useEffect, useMemo, useRef, useState } from "react";

interface ClawMachineProps {
  isAnimating: boolean;
  donationAmount?: number;
}

// Vector ball component with colors from palette
const VectorBall = ({
  size,
  color,
  rotation = 0,
  id
}: {
  size: 'small' | 'medium' | 'large';
  color: string;
  rotation?: number;
  id?: number;
}) => {
  const sizePixels = size === 'large' ? 90 : size === 'medium' ? 65 : 45;
  const radius = sizePixels / 2;
  
  // Определяем цвет на основе строки цвета
  const ballColor = color || 'hsl(330, 70%, 63%)'; // Розовый по умолчанию
  
  // Уникальный ID для градиента (используем id шарика или случайное число)
  const gradientId = `ball-gradient-${id || Math.random()}-${size}`;
  const highlightId = `ball-highlight-${id || Math.random()}-${size}`;
  
  return (
    <svg
      width={sizePixels}
      height={sizePixels}
      viewBox={`0 0 ${sizePixels} ${sizePixels}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
      }}
    >
      <defs>
        {/* Градиент для объёма шарика */}
        <radialGradient id={gradientId} cx="35%" cy="35%">
          <stop offset="0%" stopColor={ballColor} stopOpacity="1" />
          <stop offset="70%" stopColor={ballColor} stopOpacity="1" />
          <stop offset="100%" stopColor={ballColor} stopOpacity="0.95" />
        </radialGradient>
        {/* Блик на шарике */}
        <radialGradient id={highlightId} cx="35%" cy="35%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Основной шарик */}
      <circle
        cx={radius}
        cy={radius}
        r={radius - 2}
        fill={`url(#${gradientId})`}
        stroke={ballColor}
        strokeWidth="1.5"
        opacity="1"
      />
      
      {/* Блик */}
      <circle
        cx={radius * 0.7}
        cy={radius * 0.7}
        r={radius * 0.4}
        fill={`url(#${highlightId})`}
      />
      
      {/* Декоративные полоски для текстуры */}
      <ellipse
        cx={radius}
        cy={radius * 0.6}
        rx={radius * 0.8}
        ry={radius * 0.2}
        fill="none"
        stroke={ballColor}
        strokeWidth="0.5"
        opacity="0.3"
      />
      <ellipse
        cx={radius}
        cy={radius * 1.4}
        rx={radius * 0.8}
        ry={radius * 0.2}
        fill="none"
        stroke={ballColor}
        strokeWidth="0.5"
        opacity="0.3"
      />
    </svg>
  );
};

// Vector machine frame component
const VectorMachine = ({
  isAnimating
}: {
  isAnimating: boolean;
}) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0"
      style={{ zIndex: 1 }}
    >
      <defs>
        {/* Градиенты для объёма */}
        <linearGradient id="machine-frame-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(0, 0%, 12%)" stopOpacity="1" />
          <stop offset="50%" stopColor="hsl(0, 0%, 8%)" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(0, 0%, 5%)" stopOpacity="1" />
        </linearGradient>
        
        <linearGradient id="machine-glass-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(219, 77%, 20%)" stopOpacity="0.3" />
          <stop offset="50%" stopColor="hsl(219, 77%, 15%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(0, 0%, 5%)" stopOpacity="0.5" />
        </linearGradient>
        
        <linearGradient id="machine-border-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(330, 70%, 63%)" stopOpacity="0.5" />
          <stop offset="50%" stopColor="hsl(330, 70%, 63%)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(330, 70%, 63%)" stopOpacity="0.5" />
        </linearGradient>
        
        {/* Эффект стекла */}
        <filter id="glass-blur">
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </defs>
      
      {/* Основной корпус автомата */}
      <rect
        x="20"
        y="20"
        width="760"
        height="560"
        rx="48"
        fill="url(#machine-frame-gradient)"
        stroke="url(#machine-border-gradient)"
        strokeWidth="8"
        opacity="0.95"
      />
      
      {/* Внутренняя рамка */}
      <rect
        x="60"
        y="80"
        width="680"
        height="400"
        rx="32"
        fill="none"
        stroke="hsl(330, 70%, 63%)"
        strokeWidth="4"
        strokeOpacity="0.4"
      />
      
      {/* Стеклянное окно (прозрачное с эффектом) */}
      <rect
        x="70"
        y="90"
        width="660"
        height="380"
        rx="28"
        fill="url(#machine-glass-gradient)"
        stroke="hsl(330, 70%, 63%)"
        strokeWidth="3"
        strokeOpacity="0.2"
        filter="url(#glass-blur)"
        opacity="0.8"
      />
      
      {/* Блик на стекле */}
      <ellipse
        cx="400"
        cy="200"
        rx="200"
        ry="100"
        fill="url(#machine-glass-gradient)"
        opacity="0.2"
        transform="rotate(-15 400 200)"
      />
      
      {/* Декоративные углы */}
      <circle cx="80" cy="100" r="8" fill="hsl(330, 70%, 63%)" opacity="0.6" />
      <circle cx="720" cy="100" r="8" fill="hsl(330, 70%, 63%)" opacity="0.6" />
      <circle cx="80" cy="460" r="8" fill="hsl(330, 70%, 63%)" opacity="0.6" />
      <circle cx="720" cy="460" r="8" fill="hsl(330, 70%, 63%)" opacity="0.6" />
      
      {/* Нижняя часть автомата (приёмник шариков) */}
      <rect
        x="340"
        y="470"
        width="120"
        height="60"
        rx="8"
        fill="hsl(0, 0%, 8%)"
        stroke="hsl(330, 70%, 63%)"
        strokeWidth="2"
        strokeOpacity="0.3"
      />
      
      {/* Декоративные лампочки сверху */}
      {Array.from({ length: 8 }).map((_, i) => (
        <circle
          key={i}
          cx={100 + i * 100}
          cy="50"
          r={isAnimating ? 4 : 3}
          fill={i % 2 === 0 ? 'hsl(12, 100%, 50%)' : 'hsl(330, 70%, 63%)'}
          opacity={isAnimating ? 0.9 : 0.6}
        >
          {isAnimating && (
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="1s"
              repeatCount="indefinite"
              begin={`${i * 0.1}s`}
            />
          )}
        </circle>
      ))}
    </svg>
  );
};

// Vector claw component with animated blades
const VectorClaw = ({ 
  phase, 
  clawTier,
  grabbedBallColor,
  grabbedBallSize
}: { 
  phase: string; 
  clawTier: string;
  grabbedBallColor?: string;
  grabbedBallSize?: 'small' | 'medium' | 'large';
}) => {
  const clawSize = 
    clawTier === 'giant-triple' ? 128 :
    clawTier === 'giant' ? 112 :
    clawTier === 'gold' ? 96 : 80;

  // Determine blade angles based on phase
  // When open: blades spread wide to grab ball
  // When closed: blades come together to hold ball
  let bladeOpenAngle = 0; // Base angle
  if (phase === 'open') {
    bladeOpenAngle = 35; // Blades open WIDE для заметной анимации
  } else if (phase === 'close' || phase === 'grab' || phase === 'ascend') {
    bladeOpenAngle = -15; // Blades close TIGHTLY для заметного захвата
  } else if (phase === 'idle' || phase === 'approach' || phase === 'descend') {
    bladeOpenAngle = 5; // Слегка открыты в нейтральной позиции
  } else if (phase === 'pause') {
    bladeOpenAngle = 8; // Немного качаются
  }
  
  // Используем цвета из палитры
  const clawColor = 
    clawTier === 'giant-triple' || clawTier === 'giant' ? 'hsl(12, 100%, 50%)' : // Оранжевый
    clawTier === 'gold' ? 'hsl(64, 73%, 48%)' : // Желтый
    'hsl(330, 70%, 63%)'; // Розовый для обычной клешни

  return (
    <svg
      width={clawSize}
      height={clawSize}
      viewBox="0 0 100 100"
      className="drop-shadow-lg"
      style={{
        filter: clawTier === 'gold' 
          ? 'drop-shadow(0 0 12px hsla(64,73%,48%,0.6)) drop-shadow(0 0 24px hsla(64,73%,48%,0.4))'
          : clawTier === 'giant' || clawTier === 'giant-triple'
          ? 'drop-shadow(0 0 16px hsla(12,100%,50%,0.7)) drop-shadow(0 0 32px hsla(12,100%,50%,0.5))'
          : 'drop-shadow(0 0 8px hsla(330,70%,63%,0.35))',
        transformOrigin: '50% 20%',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Claw base/housing */}
      <circle
        cx="50"
        cy="20"
        r="8"
        fill={clawColor}
        stroke="#ffffff"
        strokeWidth="1.5"
        opacity="0.9"
      />
      
      {/* Three animated blades with optional grabbed ball rendered between them */}
      <g transform={`translate(50, 20)`}>
        {/* Bottom blade - behind the ball */}
        <path
          d="M -3 12 L 0 48 L 3 52 L 3 15 L -3 15 Z"
          fill={clawColor}
          stroke="#ffffff"
          strokeWidth="1.5"
          transform={`rotate(${bladeOpenAngle * 0.5})`}
          transformOrigin="0 0"
          style={{
            transition: phase === 'open' ? 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' : 
                       phase === 'close' ? 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 
                       'transform 0.3s ease',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}
        />

        {/* Grabbed ball inside the claw, between blades */}
        {grabbedBallColor && grabbedBallSize && (phase === 'grab' || phase === 'ascend') && (
          <g transform={`translate(-15, 35)`}>
            <defs>
              <radialGradient id={`grabbed-ball-grad-${grabbedBallSize}`} cx="35%" cy="35%">
                <stop offset="0%" stopColor={grabbedBallColor} stopOpacity="1" />
                <stop offset="100%" stopColor={grabbedBallColor} stopOpacity="1" />
              </radialGradient>
            </defs>
            <circle
              cx={grabbedBallSize === 'large' ? 15 : grabbedBallSize === 'medium' ? 12 : 9}
              cy={grabbedBallSize === 'large' ? 15 : grabbedBallSize === 'medium' ? 12 : 9}
              r={grabbedBallSize === 'large' ? 15 : grabbedBallSize === 'medium' ? 12 : 9}
              fill={`url(#grabbed-ball-grad-${grabbedBallSize})`}
              opacity="1"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))'
              }}
            />
            {/* Блик на шарике в клешне */}
            <circle
              cx={(grabbedBallSize === 'large' ? 15 : grabbedBallSize === 'medium' ? 12 : 9) * 0.7}
              cy={(grabbedBallSize === 'large' ? 15 : grabbedBallSize === 'medium' ? 12 : 9) * 0.7}
              r={(grabbedBallSize === 'large' ? 15 : grabbedBallSize === 'medium' ? 12 : 9) * 0.3}
              fill="#ffffff"
              opacity="0.5"
            />
          </g>
        )}

        {/* Left blade - above the ball */}
        <path
          d="M -5 10 L -15 45 L -5 50 L -2 45 L -2 15 Z"
          fill={clawColor}
          stroke="#ffffff"
          strokeWidth="1.5"
          transform={`rotate(${-30 - bladeOpenAngle})`}
          transformOrigin="0 0"
          style={{
            transition: phase === 'open' ? 'transform 0.5s ease-out' : 
                       phase === 'close' ? 'transform 0.3s ease-in' : 
                       'transform 0.3s ease',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
          }}
        />

        {/* Right blade - above the ball */}
        <path
          d="M 5 10 L 15 45 L 5 50 L 2 45 L 2 15 Z"
          fill={clawColor}
          stroke="#ffffff"
          strokeWidth="1.5"
          transform={`rotate(${30 + bladeOpenAngle})`}
          transformOrigin="0 0"
          style={{
            transition: phase === 'open' ? 'transform 0.5s ease-out' : 
                       phase === 'close' ? 'transform 0.3s ease-in' : 
                       'transform 0.3s ease',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
          }}
        />
      </g>
      
      {/* Claw tips glow effect when closing */}
      {(phase === 'close' || phase === 'grab') && (
        <g>
          <circle cx="35" cy="65" r="3" fill="#fff" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="68" r="3" fill="#fff" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.4s" begin="0.1s" repeatCount="indefinite" />
          </circle>
          <circle cx="65" cy="65" r="3" fill="#fff" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.4s" begin="0.2s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
    </svg>
  );
};

export const ClawMachine = ({ isAnimating, donationAmount = 0 }: ClawMachineProps) => {
  const [clawPosition, setClawPosition] = useState({ x: 50, y: 10 });
  const animationTimeoutRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<
    'idle' | 'approach' | 'pause' | 'descend' | 'open' | 'close' | 'grab' | 'ascend'
  >('idle');
  const [grabbedBall, setGrabbedBall] = useState<null | { id: number; color: string; size: 'small' | 'medium' | 'large' }>(null);
  const [playSound, setPlaySound] = useState(true);

  // Determine claw tier based on donation amount
  const clawTier = useMemo(() => {
    if (donationAmount >= 1000) return 'giant-triple';
    if (donationAmount >= 500) return 'giant';
    if (donationAmount >= 200) return 'gold';
    return 'normal';
  }, [donationAmount]);

  // Determine if we need multiple claws (for 1000+ donations)
  const needsMultipleClaws = clawTier === 'giant-triple';

  // Define ball colors - используем указанные HEX цвета для всех размеров
  // Вынесено за пределы useMemo для стабильности
  const ballColors = useMemo(() => [
    '#FF1493',  // Deep Pink
    '#20B2AA',  // Light Sea Green
    '#9932CC',  // Dark Orchid
    '#00CED1',  // Dark Turquoise
    '#DC143C'   // Crimson
  ], []);

  const balls = useMemo(() => {
    const ballCount = needsMultipleClaws ? 35 : 30; // Much more balls for variety
    
    // Create balls with realistic physics - they stack on each other
    const balls = [];
    const ballSizes = ['small', 'medium', 'large'];
    const ballSizePixels = { small: 35, medium: 50, large: 70 };
    
    // Create a grid of positions for realistic stacking
    const gridCols = 8;
    const gridRows = 4;
    const cellWidth = 80 / gridCols; // 80% width divided by columns
    const cellHeight = 40 / gridRows; // 40% height divided by rows
    
    for (let i = 0; i < ballCount; i++) {
      const size = (() => {
        // Different ball sizes based on claw tier
        if (clawTier === 'giant-triple' || clawTier === 'giant') {
          return Math.random() < 0.3 ? 'large' : Math.random() < 0.6 ? 'medium' : 'small';
        }
        if (clawTier === 'gold') {
          return Math.random() < 0.2 ? 'large' : Math.random() < 0.5 ? 'medium' : 'small';
        }
        return Math.random() < 0.1 ? 'large' : Math.random() < 0.4 ? 'medium' : 'small';
      })();
      
      // Calculate position in grid with some randomness
      const col = i % gridCols;
      const row = Math.floor(i / gridCols);
      
      // Add some randomness to make it look natural
      const randomOffsetX = (Math.random() - 0.5) * 8; // ±4% randomness
      const randomOffsetY = (Math.random() - 0.5) * 4; // ±2% randomness
      
      const x = 10 + (col * cellWidth) + randomOffsetX;
      // Шарики должны лежать НА ВНУТРЕННЕЙ ЛИНИИ СТЕКЛА (border-2)
      // Контейнер имеет border-4 (4px), внутренняя рамка border-2 (2px) находится на inset-0
      // С учетом закругления rounded-2xl (16px), нижняя внутренняя линия будет примерно на 96-97%
      // Шарики должны касаться именно этой внутренней границы стекла
      const innerLineBottom = 96.5; // Внутренняя линия стекла снизу (с учетом border и закругления)
      const stackHeight = row * cellHeight * 0.35; // Небольшое наложение для стопки
      const y = innerLineBottom - stackHeight + randomOffsetY;
      
      // Выбираем случайный цвет для шарика из палитры
      const color = ballColors[Math.floor(Math.random() * ballColors.length)];
      
      balls.push({
        id: i,
        x: Math.max(5, Math.min(95, x)), // Keep within bounds
        y: Math.max(93, Math.min(97, y)), // Шарики лежат РОВНО НА внутренней линии стекла снизу
        size,
        color,
        delay: Math.random() * 4,
        rotation: Math.random() * 360 // Random rotation for variety
      });
    }
    
    return balls;
  }, [clawTier, needsMultipleClaws, ballColors]);

  // Determine which ball size to grab based on donation amount
  const targetBallSize = useMemo(() => {
    if (donationAmount >= 1000) return 'large'; // Triple claws grab large balls
    if (donationAmount >= 500) return 'large';  // Giant claw grabs large balls
    if (donationAmount >= 200) return 'medium'; // Gold claw grabs medium balls
    return 'small'; // Normal claw grabs small balls
  }, [donationAmount]);

  const targetRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // clear pending timers on unmount or re-run
    return () => {
      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isAnimating) {
      setPhase('idle');
      setGrabbedBall(null);
      return;
    }

    // Sequence: approach -> pause(sway) -> descend -> open -> close -> grab -> ascend
    setPhase('approach');
    
    // Find a ball of the target size, or fallback to any ball
    const targetBalls = balls.filter(ball => ball.size === targetBallSize);
    const chosen = targetBalls.length > 0 
      ? targetBalls[Math.floor(Math.random() * targetBalls.length)]
      : balls[Math.floor(Math.random() * balls.length)];
    
    targetRef.current = { x: chosen.x, y: chosen.y };

    // approach above the target and stop a bit higher
    setClawPosition({ x: chosen.x, y: Math.max(20, chosen.y - 25) });
    animationTimeoutRef.current = window.setTimeout(() => {
      setPhase('pause');
      // dramatic sway pause
      animationTimeoutRef.current = window.setTimeout(() => {
        setPhase('descend');
        // slower descent - 2 seconds, precisely to the ball position
        // Клешня спускается ровно на уровень шарика - НЕ НИЖЕ внутренней границы стекла!
        // Шарики на y: 93-97% (на внутренней линии стекла)
        // Лопасти клешни находятся ниже центра клешни (примерно на 20% высоты клешни ниже)
        // Чтобы лопасти были на уровне центра шарика, но НЕ ниже внутренней границы (93%):
        // - Центр шарика: chosen.y (93-97%)
        // - Лопасти клешни находятся примерно на 4-5% ниже центра клешни
        // - Внутренняя граница стекла: 93%
        // Клешня должна быть так, чтобы лопасти (которые ниже центра) не ушли ниже 93%
        const innerGlassBorder = 93; // Внутренняя граница стекла - НЕ МОЖЕМ СПУСКАТЬСЯ НИЖЕ!
        const clawBladeOffset = 15; // Увеличенный безопасный оффсет: держим центр клешни значительно выше
        const ballCenterY = chosen.y; // Центр шарика
        
        // Рассчитываем позицию клешни: лопасти должны быть на уровне центра шарика или ВЫШЕ внутренней границы
        // Чтобы гарантировать, что лопасти не пересекут 93%, центр клешни должен быть на уровне 85% или выше
        // clawCenter + clawBladeOffset должно быть >= innerGlassBorder
        // Значит: clawCenter >= innerGlassBorder - clawBladeOffset = 93 - 15 = 78%
        // Но также хотим, чтобы клешня была достаточно близко к шарику для захвата
        const minClawY = Math.max(ballCenterY - clawBladeOffset, innerGlassBorder - clawBladeOffset);
        const clawTargetY = Math.min(minClawY, 85); // Подняли ограничение до 85% - лопасти точно не опустятся ниже 93%
        
        setClawPosition({ x: chosen.x, y: clawTargetY });
        animationTimeoutRef.current = window.setTimeout(() => {
            setPhase('open');
            // claw opens (expands) - 0.6s - шарик ещё виден под открывающимися лопастями
            // АНИМАЦИЯ ОТКРЫТИЯ ДОЛЖНА БЫТЬ ЗАМЕТНОЙ
            animationTimeoutRef.current = window.setTimeout(() => {
              setPhase('close');
              // claw closes (squeezes) - 0.4s - лопасти закрываются вокруг шарика
              // Шарик исчезает из исходного места и появляется в клешне
              // АНИМАЦИЯ ЗАХВАТА ДОЛЖНА БЫТЬ ЗАМЕТНОЙ
              animationTimeoutRef.current = window.setTimeout(() => {
                setPhase('grab');
                // brief hold + attach ball + optional sound
                // Шарик теперь виден между лопастями внутри клешни
                setGrabbedBall({ id: chosen.id, color: chosen.color, size: chosen.size });
                if (playSound) {
                  const audio = new Audio('/click.mp3');
                  audio.play().catch(() => {});
                }
              animationTimeoutRef.current = window.setTimeout(() => {
                setPhase('ascend');
                // Move claw up gradually, ball follows between blades
                setClawPosition({ x: chosen.x, y: chosen.y - 30 }); // Start moving up
                animationTimeoutRef.current = window.setTimeout(() => {
                  setClawPosition({ x: 50, y: 10 }); // Final position at top center
                }, 500); // Halfway point
                // Show prediction when claw reaches the top with the ball
                setTimeout(() => {
                  // This will be handled by the parent component
                }, 1000); // 1 second for ascent
              }, 400);
            }, 300);
          }, 500);
        }, 2000); // slower descent
      }, 1200);
    }, 1000);
  }, [isAnimating, balls, targetBallSize, playSound]);

  return (
    <div className="relative w-full max-w-2xl mx-auto" data-claw-machine>
      {/* Machine Frame */}
      <div className="relative bg-gradient-to-b from-card/90 via-card/80 to-card/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border-4 border-accent/40 shadow-2xl">
        
        {/* Machine Top Panel */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-b from-accent/30 to-transparent rounded-t-2xl"></div>
        
        {/* Warning Sign */}
        <div 
          className={`absolute -top-6 left-1/2 -translate-x-1/2 bg-destructive text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg rotate-[-2deg] z-10 ${isAnimating ? 'animate-shake' : ''}`}
        >
          НЕ ТРОГАТЬ! ЭТО НА НОВЫЙ ГОД
        </div>

        {/* Machine Interior - Display case */}
        <div 
          className="relative h-96 w-full rounded-2xl border-4 border-accent/50 overflow-hidden shadow-inner"
          style={{
            background: 'linear-gradient(180deg, hsl(219, 77%, 15%), hsl(0, 0%, 5%))'
          }}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10"></div>
          
          {/* Balls - они лежат на дне, за стеклом */}
          {balls.map((ball) => {
            // Hide ball when it's grabbed (during close phase - when claws close around it)
            const isGrabbed = grabbedBall && grabbedBall.id === ball.id;
            // Шарик исчезает когда клешня закрывается (close), чтобы визуально он "оказался" внутри
            const shouldHide = isGrabbed && (phase === 'close' || phase === 'grab' || phase === 'ascend');
            
            return (
              <div
                key={ball.id}
                className="absolute z-10"
                style={{
                  left: `${ball.x}%`,
                  top: `${ball.y}%`,
                  width: ball.size === 'large' ? '90px' : ball.size === 'medium' ? '65px' : '45px',
                  height: ball.size === 'large' ? '90px' : ball.size === 'medium' ? '65px' : '45px',
                  transform: `translate(-50%, -50%) rotate(${ball.rotation}deg)`,
                  opacity: shouldHide ? 0 : 1,
                  transition: shouldHide ? 'opacity 0.15s ease-out' : 'all 0.3s ease',
                }}
              >
                <VectorBall 
                  size={ball.size} 
                  color={ball.color}
                  rotation={ball.rotation}
                  id={ball.id}
                />
              </div>
            );
          })}
          
          {/* Vector Glass - векторное стекло ПОВЕРХ шариков, но ПОД клешнёй */}
          <div className="absolute inset-0 z-15 pointer-events-none" style={{ zIndex: 15 }}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0"
            >
              <defs>
                {/* Градиент для эффекта стекла */}
                <linearGradient id="glass-front-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.03)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
                </linearGradient>
                {/* Рефлексы на стекле */}
                <linearGradient id="glass-reflection" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.2)" stopOpacity="0" />
                  <stop offset="30%" stopColor="rgba(255,255,255,0.15)" stopOpacity="0.3" />
                  <stop offset="60%" stopColor="rgba(255,255,255,0.1)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.05)" stopOpacity="0" />
                </linearGradient>
                {/* Эффект размытия краёв */}
                <filter id="glass-edge-blur">
                  <feGaussianBlur stdDeviation="0.3" />
                </filter>
              </defs>
              
              {/* Основное стекло */}
              <rect
                x="0"
                y="0"
                width="100"
                height="100"
                rx="14"
                fill="url(#glass-front-gradient)"
                opacity="0.4"
              />
              
              {/* Рефлекс на стекле */}
              <ellipse
                cx="50"
                cy="35"
                rx="40"
                ry="25"
                fill="url(#glass-reflection)"
                opacity="0.6"
              />
              
              {/* Верхний блик */}
              <rect
                x="10"
                y="5"
                width="80"
                height="8"
                rx="4"
                fill="rgba(255,255,255,0.15)"
                opacity="0.5"
              />
              
              {/* Нижний оттенок - УБРАН, так как создавал темную полосу */}
            </svg>
          </div>
          
          {/* Внутренняя линия стекла - именно на ней должны лежать шарики */}
          <div className="absolute inset-0 border-2 border-accent/30 rounded-2xl pointer-events-none z-15" style={{ zIndex: 16 }}></div>
          {/* Дополнительная подсветка нижней линии для визуализации "дна" */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent/20 z-14" style={{ zIndex: 15, top: '97%' }}></div>
          
          {/* Claw(s) - КЛЕШНЯ ПОВЕРХ ВСЕГО (сверху стекла) */}
          {needsMultipleClaws ? (
            // Triple claws for 1000+ donations
            <>
              <div 
                className="absolute w-16 h-24 transition-all duration-1000 ease-in-out z-20"
                style={{ 
                  left: `${clawPosition.x - 15}%`, 
                  top: `${clawPosition.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div 
                  className="relative"
                  style={{
                    transformOrigin: '50% 0%',
                    animation: phase === 'idle' ? 'sway 4s ease-in-out infinite' : undefined
                  }}
                >
                  {/* Cable - прикреплен к верхней части контейнера и идет вниз до начала клешни */}
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-muted-foreground/50"
                    style={{
                      top: '0',
                      height: '40px', // Точно до начала клешни (которая на top: 40px)
                      transformOrigin: '50% 0%'
                    }}
                  ></div>
                  {/* Vector Claw - находится точно на том же уровне, где заканчивается кабель */}
                  <div 
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                      top: '40px', // Начало клешни совпадает с концом кабеля
                      animation: phase === 'pause' ? 'sway 1.2s ease-in-out infinite' : undefined,
                      transformOrigin: '50% 20%'
                    }}
                  >
                    <VectorClaw 
                      phase={phase} 
                      clawTier={clawTier}
                      grabbedBallColor={grabbedBall?.color}
                      grabbedBallSize={grabbedBall?.size}
                    />
                  </div>
                  
                  {/* Ball is now rendered inside SVG between blades via VectorClaw */}
                </div>
              </div>
              <div 
                className="absolute w-16 h-24 transition-all duration-1000 ease-in-out z-20"
                style={{ 
                  left: `${clawPosition.x}%`, 
                  top: `${clawPosition.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div 
                  className="relative"
                  style={{
                    transformOrigin: '50% 0%',
                    animation: phase === 'idle' ? 'sway 4s ease-in-out infinite' : undefined
                  }}
                >
                  {/* Cable - прикреплен к верхней части контейнера и идет вниз до начала клешни */}
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-muted-foreground/50"
                    style={{
                      top: '0',
                      height: '40px', // Точно до начала клешни (которая на top: 40px)
                      transformOrigin: '50% 0%'
                    }}
                  ></div>
                  {/* Vector Claw - находится точно на том же уровне, где заканчивается кабель */}
                  <div 
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                      top: '40px', // Начало клешни совпадает с концом кабеля
                      animation: phase === 'pause' ? 'sway 1.2s ease-in-out infinite' : undefined,
                      transformOrigin: '50% 20%'
                    }}
                  >
                    <VectorClaw 
                      phase={phase} 
                      clawTier={clawTier}
                      grabbedBallColor={grabbedBall?.color}
                      grabbedBallSize={grabbedBall?.size}
                    />
                  </div>
                </div>
              </div>
              <div 
                className="absolute w-16 h-24 transition-all duration-1000 ease-in-out z-20"
                style={{ 
                  left: `${clawPosition.x + 15}%`, 
                  top: `${clawPosition.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div 
                  className="relative"
                  style={{
                    transformOrigin: '50% 0%',
                    animation: phase === 'idle' ? 'sway 4s ease-in-out infinite' : undefined
                  }}
                >
                  {/* Cable - прикреплен к верхней части контейнера и идет вниз до начала клешни */}
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-muted-foreground/50"
                    style={{
                      top: '0',
                      height: '40px', // Точно до начала клешни (которая на top: 40px)
                      transformOrigin: '50% 0%'
                    }}
                  ></div>
                  {/* Vector Claw - находится точно на том же уровне, где заканчивается кабель */}
                  <div 
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                      top: '40px', // Начало клешни совпадает с концом кабеля
                      animation: phase === 'pause' ? 'sway 1.2s ease-in-out infinite' : undefined,
                      transformOrigin: '50% 20%'
                    }}
                  >
                    <VectorClaw 
                      phase={phase} 
                      clawTier={clawTier}
                      grabbedBallColor={grabbedBall?.color}
                      grabbedBallSize={grabbedBall?.size}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Single claw for normal donations
            <div 
              className="absolute w-16 h-24 transition-all duration-1000 ease-in-out z-20"
              style={{ 
                left: `${clawPosition.x}%`, 
                top: `${clawPosition.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div 
                className="relative"
                style={{
                  transformOrigin: '50% 0%',
                  animation: phase === 'idle' ? 'sway 4s ease-in-out infinite' : undefined
                }}
              >
                {/* Cable - прикреплен к верхней части контейнера и идет вниз до начала клешни */}
                <div 
                  className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-muted-foreground/50"
                  style={{
                    top: '0',
                    height: '40px', // Точно до начала клешни (которая на top: 40px)
                    transformOrigin: '50% 0%'
                  }}
                ></div>

                {/* Vector Claw - находится точно на том же уровне, где заканчивается кабель */}
                <div 
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{
                    top: '40px', // Начало клешни совпадает с концом кабеля
                    animation: phase === 'pause' ? 'sway 1.2s ease-in-out infinite' : undefined,
                    transformOrigin: '50% 20%'
                  }}
                >
                  <VectorClaw 
                    phase={phase} 
                    clawTier={clawTier}
                    grabbedBallColor={grabbedBall?.color}
                    grabbedBallSize={grabbedBall?.size}
                  />
                </div>

                {/* Grab feedback */}
                {phase === 'grab' && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 border-accent/40"
                    style={{ animation: 'grab 0.6s ease-in-out' }}
                  ></div>
                )}

                {/* Ball is now rendered inside SVG between blades via VectorClaw */}
              </div>
            </div>
          )}

          {/* Prize Chute */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-12 bg-background/60 rounded-t-xl border-t-2 border-x-2 border-accent/30"></div>
        </div>

        {/* Machine Bottom Panel */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-t from-accent/30 to-transparent rounded-b-2xl"></div>

        {/* Decorative Lights */}
        <div className="absolute -top-2 left-0 right-0 flex justify-around px-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full animate-glow-pulse"
              style={{
                backgroundColor: i % 2 === 0 ? 'hsl(12, 100%, 50%)' : 'hsl(330, 70%, 63%)',
                animationDelay: `${i * 0.2}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
