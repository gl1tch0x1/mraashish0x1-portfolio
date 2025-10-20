import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const FadeInSection = ({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up', // up, down, left, right
  duration = 0.6 
}) => {
  const { targetRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px'
  });

  const getTransform = () => {
    if (hasIntersected) return 'translate(0, 0)';
    
    switch (direction) {
      case 'up':
        return 'translate(0, 50px)';
      case 'down':
        return 'translate(0, -50px)';
      case 'left':
        return 'translate(50px, 0)';
      case 'right':
        return 'translate(-50px, 0)';
      default:
        return 'translate(0, 50px)';
    }
  };

  return (
    <div
      ref={targetRef}
      className={className}
      style={{
        opacity: hasIntersected ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`
      }}
    >
      {children}
    </div>
  );
};

export default FadeInSection;

