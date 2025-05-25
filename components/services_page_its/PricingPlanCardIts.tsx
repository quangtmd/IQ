
import React from 'react';
import { PricingPlan } from '../../types';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

interface PricingPlanCardItsProps {
  plan: PricingPlan;
  index: number;
}

const PricingPlanCardIts: React.FC<PricingPlanCardItsProps> = ({ plan, index }) => {
  return (
    <div 
      className={`pricing-plan-card-its bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col transition-all duration-300 border-2 ${plan.isPopular ? 'border-primary shadow-primary/30' : 'border-borderDefault hover:border-primary/50 hover:shadow-xl'} relative`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {plan.isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="bg-primary text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider">
            Phổ biến
          </span>
        </div>
      )}
      <div className="text-center mb-6 pt-2">
        <h3 className="text-2xl font-bold text-textBase mb-1">{plan.name}</h3>
        <p className="text-4xl font-extrabold text-primary my-3">
          {plan.price}
          {plan.period && <span className="text-base font-medium text-textMuted ml-1">/ {plan.period}</span>}
        </p>
      </div>
      
      <div className="border-t border-borderDefault pt-6 mb-8 flex-grow">
        <ul className="space-y-3 text-sm">
          {plan.features.map((feature, idx) => {
            const isUnavailable = feature.startsWith('!');
            const featureText = isUnavailable ? feature.substring(1) : feature;
            return (
              <li key={idx} className={`flex items-start ${isUnavailable ? 'unavailable' : 'text-textMuted'}`}>
                <i className={`fas ${isUnavailable ? 'fa-times-circle' : 'fa-check-circle'} mr-3 mt-1 text-base flex-shrink-0`}></i>
                <span>{featureText}</span>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="mt-auto">
        <Link to={plan.buttonLink || '/contact'} className="block">
          <Button 
            variant={plan.isPopular ? 'primary' : 'outline'} 
            size="lg" 
            className="w-full py-3"
          >
            {plan.buttonText || 'Chọn Gói Này'}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PricingPlanCardIts;
