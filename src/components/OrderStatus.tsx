import React from 'react';
import { ClipboardList, CheckCircle2, Box, Truck, MapPin, ShieldCheck, XCircle, Clock } from 'lucide-react';
import { OrderStatus as StatusType } from '../services/db';

interface OrderStatusProps {
  status: StatusType;
}

export const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
  const steps: { key: StatusType; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    {
      key: 'pending',
      label: 'Order Placed',
      icon: ClipboardList,
      desc: 'Seller notified'
    },
    {
      key: 'confirmed',
      label: 'Confirmed',
      icon: ShieldCheck,
      desc: 'Artisan approved'
    },
    {
      key: 'packed',
      label: 'Packed',
      icon: Box,
      desc: 'Festively packaged'
    },
    {
      key: 'shipped',
      label: 'Shipped',
      icon: Truck,
      desc: 'In transit'
    },
    {
      key: 'out_for_delivery',
      label: 'Out for Delivery',
      icon: Clock,
      desc: 'Arriving today'
    },
    {
      key: 'delivered',
      label: 'Delivered',
      icon: MapPin,
      desc: 'Enjoy your Onam!'
    }
  ];

  if (status === 'cancelled') {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-950 p-6 rounded-2xl flex items-center gap-4">
        <XCircle className="w-12 h-12 text-rose-600 shrink-0" />
        <div>
          <h4 className="font-serif font-bold text-lg text-rose-800">Order Cancelled</h4>
          <p className="text-sm text-rose-900/80 font-sans mt-0.5">
            This order has been cancelled and a full refund has been initiated (if paid online).
          </p>
        </div>
      </div>
    );
  }

  // Find index of current status to highlight steps
  // Note: if current status is "out_for_delivery", we can map it to "shipped" or treat it between shipped and delivered
  const getActiveIndex = () => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'packed': return 2;
      case 'shipped': return 3;
      case 'out_for_delivery': return 4;
      case 'delivered': return 5;
      default: return 0;
    }
  };

  const activeIndex = getActiveIndex();

  return (
    <div className="w-full">
      {/* Desktop Timeline (Horizontal) */}
      <div className="hidden md:flex items-center justify-between w-full relative py-4">
        
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0 rounded-full">
          <div
            className="h-full bg-onam-green transition-all duration-700 rounded-full"
            style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Timeline Nodes */}
        {steps.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;
          
          return (
            <div key={step.key} className="flex flex-col items-center z-10 relative bg-onam-cream px-2">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-onam-green border-onam-green text-onam-cream shadow-md'
                    : isActive
                    ? 'bg-onam-gold border-onam-gold text-onam-green shadow-md scale-110 active-pulse-gold'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {React.createElement(step.icon, { className: 'w-5 h-5' })}
              </div>
              <span
                className={`font-serif text-xs font-bold mt-2 text-center ${
                  isActive ? 'text-onam-gold-dark' : isCompleted ? 'text-onam-green' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5 text-center font-sans">
                {step.desc}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Timeline (Vertical) */}
      <div className="flex md:hidden flex-col gap-6 relative pl-6 py-2">
        {/* Vertical line indicator */}
        <div className="absolute left-[17px] top-4 bottom-4 w-1 bg-gray-200 rounded-full z-0">
          <div
            className="w-full bg-onam-green transition-all duration-700 rounded-full"
            style={{ height: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;

          return (
            <div key={step.key} className="flex items-start gap-4 z-10 relative">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-onam-green border-onam-green text-onam-cream shadow-sm'
                    : isActive
                    ? 'bg-onam-gold border-onam-gold text-onam-green shadow scale-105 active-pulse-gold'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {React.createElement(step.icon, { className: 'w-4 h-4' })}
              </div>
              <div className="flex flex-col pt-1">
                <span
                  className={`font-serif text-sm font-bold leading-tight ${
                    isActive ? 'text-onam-gold-dark' : isCompleted ? 'text-onam-green' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-xs text-gray-400 font-sans mt-0.5">
                  {step.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default OrderStatus;
