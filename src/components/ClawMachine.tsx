import { useEffect, useMemo, useRef, useState } from "react";

interface ClawMachineProps {
  isAnimating: boolean;
  donationAmount?: number;
}

// Vector claw component with animated blades
const VectorClaw = ({ 
  phase, 
  clawTier,
  grabbedBallImage,
  grabbedBallSize
}: { 
  phase: string; 
  clawTier: string;
  grabbedBallImage?: string;
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
    bladeOpenAngle = 30; // Blades open wide
  } else if (phase === 'close' || phase === 'grab' || phase === 'ascend') {
    bladeOpenAngle = -10; // Blades close tightly
  } else if (phase === 'idle' || phase === 'approach' || phase === 'descend') {
    bladeOpenAngle = 0; // Neutral position
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
            transition: phase === 'open' ? 'transform 0.5s ease-out' : 
                       phase === 'close' ? 'transform 0.3s ease-in' : 
                       'transform 0.3s ease',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}
        />

        {/* Grabbed ball inside the claw, between blades */}
        {grabbedBallImage && (phase === 'grab' || phase === 'ascend') && (
          <image
            href={`/${grabbedBallImage}`}
            x={-15}
            y={35}
            width={grabbedBallSize === 'large' ? 30 : grabbedBallSize === 'medium' ? 24 : 18}
            height={grabbedBallSize === 'large' ? 30 : grabbedBallSize === 'medium' ? 24 : 18}
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))'
            }}
          />
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
  const [grabbedBall, setGrabbedBall] = useState<null | { id: number; color: string; size: 'small' | 'medium' | 'large'; image: string }>(null);
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

  // Define ball images by size
  const ballImages = {
    small: ['ball_small_orange.png', 'ball_small_red.png', 'ball_small_yellow.png'],
    medium: ['ball_medium_green.png', 'ball_medium_pink.png', 'ball_medium_purple.png'],
    large: ['ball_big_blue.png', 'ball_big_grass.png', 'ball_big_pink.png']
  };

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
      // Position balls on the floor - start from 85% (floor level) and stack up slightly
      const baseY = 85; // Floor level
      const stackHeight = row * cellHeight * 0.4; // Stack height
      const y = baseY - stackHeight + randomOffsetY;
      
      balls.push({
        id: i,
        x: Math.max(5, Math.min(95, x)), // Keep within bounds
        y: Math.max(78, Math.min(90, y)), // Keep within bounds - balls on floor level
        size,
        image: ballImages[size][Math.floor(Math.random() * ballImages[size].length)],
        delay: Math.random() * 4,
        rotation: Math.random() * 360 // Random rotation for variety
      });
    }
    
    return balls;
  }, [clawTier, needsMultipleClaws]);

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
        // Position claw so its blades are at the ball's center level
        // Клешня должна спускаться так, чтобы её лопасти были на уровне центра шарика
        // Учитываем высоту клешни: центр клешни выше лопастей примерно на 3-4% от высоты контейнера
        // Поэтому спускаем клешню чуть ниже центра шарика, чтобы лопасти были точно на шарике
        setClawPosition({ x: chosen.x, y: chosen.y + 3 }); // Лопасти точно на уровне центра шарика
        animationTimeoutRef.current = window.setTimeout(() => {
            setPhase('open');
            // claw opens (expands) - 0.5s - шарик ещё виден под открывающимися лопастями
            animationTimeoutRef.current = window.setTimeout(() => {
              setPhase('close');
              // claw closes (squeezes) - 0.3s - лопасти закрываются вокруг шарика
              // Шарик исчезает из исходного места и появляется в клешне
              animationTimeoutRef.current = window.setTimeout(() => {
                setPhase('grab');
                // brief hold + attach ball + optional sound
                // Шарик теперь виден между лопастями внутри клешни
                setGrabbedBall({ id: chosen.id, color: chosen.color, size: chosen.size, image: chosen.image });
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
      {/* Machine Frame - Background parts that don't fit in display */}
      <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl p-8 border-4 border-accent/30 shadow-2xl">
        
        {/* Warning Sign */}
        <div 
          className={`absolute -top-6 left-1/2 -translate-x-1/2 bg-destructive text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg rotate-[-2deg] z-10 ${isAnimating ? 'animate-shake' : ''}`}
        >
          НЕ ТРОГАТЬ! ЭТО НА НОВЫЙ ГОД
        </div>

        {/* Machine Interior - Display case */}
        <div 
          className="relative h-96 w-full rounded-2xl border-2 border-accent/20 overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, hsl(219, 77%, 15%), hsl(0, 0%, 5%))'
          }}
        >
          {/* Semi-transparent overlay for better visibility */}
          <div className="absolute inset-0 bg-background/20"></div>
          
          {/* Claw(s) */}
          {needsMultipleClaws ? (
            // Triple claws for 1000+ donations
            <>
              <div 
                className="absolute w-16 h-24 transition-all duration-1000 ease-in-out z-20"
                style={{ 
                  left: `${clawPosition.x - 15}%`, 
                  top: `${clawPosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                  animation: phase === 'pause' ? 'sway 1.2s ease-in-out infinite' : 
                            phase === 'idle' ? 'sway 3s ease-in-out infinite' : undefined
                }}
              >
                <div className="relative">
                  <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-14 bg-muted-foreground/50"></div>
                  <div className="absolute top-10 left-1/2 -translate-x-1/2">
                    <VectorClaw 
                      phase={phase} 
                      clawTier={clawTier}
                      grabbedBallImage={grabbedBall?.image}
                      grabbedBallSize={grabbedBall?.size}
                    />
                  </div>
                  
                  {/* Grabbed ball clamped between claw blades - moves with claw */}
                  {grabbedBall && (phase === 'grab' || phase === 'ascend') && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{
                        top: '55%', // Slightly below center to be between blades
                        width: grabbedBall.size === 'large' ? '55px' : grabbedBall.size === 'medium' ? '40px' : '28px',
                        height: grabbedBall.size === 'large' ? '55px' : grabbedBall.size === 'medium' ? '40px' : '28px',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 15, // Behind blades but visible
                        opacity: 0.9,
                      }}
                    >
                      <img
                        src={`/${grabbedBall.image}`}
                        alt="grabbed ball"
                        className="w-full h-full object-contain drop-shadow-lg"
                        style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.7))',
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div 
                className="absolute w-16 h-24 transition-all duration-1000 ease-in-out z-20"
                style={{ 
                  left: `${clawPosition.x}%`, 
                  top: `${clawPosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                  animation: phase === 'pause' ? 'sway 1.2s ease-in-out infinite' : 
                            phase === 'idle' ? 'sway 3s ease-in-out infinite' : undefined
                }}
              >
                <div className="relative">
                  <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-14 bg-muted-foreground/50"></div>
                  <div className="absolute top-10 left-1/2 -translate-x-1/2">
                    <VectorClaw 
                      phase={phase} 
                      clawTier={clawTier}
                      grabbedBallImage={grabbedBall?.image}
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
                  transform: 'translate(-50%, -50%)',
                  animation: phase === 'pause' ? 'sway 1.2s ease-in-out infinite' : 
                            phase === 'idle' ? 'sway 3s ease-in-out infinite' : undefined
                }}
              >
                <div className="relative">
                  <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-14 bg-muted-foreground/50"></div>
                  <div className="absolute top-10 left-1/2 -translate-x-1/2">
                    <VectorClaw 
                      phase={phase} 
                      clawTier={clawTier}
                      grabbedBallImage={grabbedBall?.image}
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
              <div className="relative">
                {/* Cable */}
                <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-14 bg-muted-foreground/50"></div>

                {/* Vector Claw */}
                <div 
                  className="absolute top-10 left-1/2 -translate-x-1/2"
                  style={{
                    animation: phase === 'pause' ? 'sway 1.2s ease-in-out infinite' : 
                              phase === 'idle' ? 'sway 3s ease-in-out infinite' : undefined,
                    transformOrigin: '50% 20%'
                  }}
                >
                  <VectorClaw 
                    phase={phase} 
                    clawTier={clawTier}
                    grabbedBallImage={grabbedBall?.image}
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

          {/* Prize Balls */}
          {balls.map((ball) => {
            // Hide ball when it's grabbed (during close phase - when claws close around it)
            const isGrabbed = grabbedBall && grabbedBall.id === ball.id;
            // Шарик исчезает когда клешня закрывается (close), чтобы визуально он "оказался" внутри
            const shouldHide = isGrabbed && (phase === 'close' || phase === 'grab' || phase === 'ascend');
            
            return (
              <div
                key={ball.id}
                className="absolute"
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
                <img
                  src={`/${ball.image}`}
                  alt={`${ball.size} ball`}
                  className="w-full h-full object-contain drop-shadow-lg"
                  style={{
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                  }}
                />
              </div>
            );
          })}

          {/* Prize Chute */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-12 bg-background/60 rounded-t-xl border-t-2 border-x-2 border-accent/30"></div>
        </div>

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
