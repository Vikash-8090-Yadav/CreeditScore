import { useEffect, useRef } from 'react';

interface CreditScoreCircleProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export default function CreditScoreCircle({ 
  score, 
  size = 120, 
  strokeWidth = 10 
}: CreditScoreCircleProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.strokeDasharray = `${circumference} ${circumference}`;
      circleRef.current.style.strokeDashoffset = `${circumference}`;
      
      // Trigger animation
      setTimeout(() => {
        if (circleRef.current) {
          circleRef.current.style.strokeDashoffset = `${circumference - progress}`;
        }
      }, 100);
    }
  }, [circumference, progress]);

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#10B981'; // green-500
    if (score >= 50) return '#F59E0B'; // yellow-500
    return '#EF4444'; // red-500
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1s ease-in-out',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="text-2xl font-bold">{score}</span>
          <span className="text-sm text-gray-500">/100</span>
        </div>
      </div>
    </div>
  );
} 