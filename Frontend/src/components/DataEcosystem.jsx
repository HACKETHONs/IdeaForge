import React, { useEffect, useRef, useState } from 'react';

const statsData = [
  { number: '50K+', label: 'Validated Ideas' },
  { number: '2.5K+', label: 'Expert Mentors' },
  { number: '$2.8B+', label: 'Funding Raised' },
  { number: '85%', label: 'Success Rate' },
  { number: '150+', label: 'Industries' },
];

const StatCard = ({ finalValue, label }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
          const suffix = finalValue.replace(/[\d]/g, '');
          let startValue = 0;
          const increment = numericValue / 50;
          const timer = setInterval(() => {
            startValue += increment;
            if (startValue >= numericValue) {
              setCurrentValue(finalValue);
              clearInterval(timer);
            } else {
              setCurrentValue(Math.floor(startValue) + suffix);
            }
          }, 30);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [finalValue]);

  return (
    <div className="stat-card" ref={ref}>
      <div className="stat-number">{currentValue}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

const DataEcosystem = () => {
  return (
    <section className="data-ecosystem" id="data">
      <div className="container">
        <div className="section-title">
          <h2>Trusted Data Ecosystem</h2>
          <p>Access verified data and insights to make informed decisions about your startup journey</p>
        </div>
        <div className="ecosystem-stats">
          {statsData.map((stat, index) => (
            <StatCard key={index} finalValue={stat.number} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DataEcosystem;