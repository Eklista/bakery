// src/views/Checkout.tsx
import React, { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  Trash2} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPriceByLanguage } from '../utils/currency';

interface CheckoutFormData {
  // Datos personales
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Dirección de envío
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Notas especiales
  notes: string;
  
  // Método de pago
  paymentMethod: 'cash' | 'card';
}

interface FormErrors {
  [key: string]: string;
}

const CheckoutStep = memo(({ 
  stepNumber, 
  title, 
  isActive, 
  isCompleted, 
  onClick 
}: {
  stepNumber: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
      isActive 
        ? 'bg-amber-500 text-white' 
        : isCompleted 
          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
      isActive 
        ? 'bg-white text-amber-500' 
        : isCompleted 
          ? 'bg-green-500 text-white'
          : 'bg-neutral-300 text-neutral-600'
    }`}>
      {isCompleted ? <CheckCircle size={16} /> : stepNumber}
    </div>
    <span className="font-semibold text-sm">{title}</span>
  </motion.button>
));

const CartItem = memo(({ item, onUpdateQuantity, onRemove, language }: {
  item: any;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  language: string;
}) => (
  <div className="flex items-start space-x-4 p-4 bg-neutral-50 rounded-xl">
    <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover"
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          (e.target as HTMLImageElement).src = '/cookies.webp';
        }}
      />
    </div>
    
    <div className="flex-1">
      <h3 className="font-bold text-zinc-900 mb-1">{item.title}</h3>
      <p className="text-amber-600 font-bold">
        {formatPriceByLanguage(item.price / 100, language)}
      </p>
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-neutral-200 hover:bg-neutral-100"
            whileTap={{ scale: 0.9 }}
          >
            <Minus size={12} />
          </motion.button>
          
          <span className="w-8 text-center font-bold">
            {item.quantity}
          </span>
          
          <motion.button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-neutral-200 hover:bg-neutral-100"
            whileTap={{ scale: 0.9 }}
          >
            <Plus size={12} />
          </motion.button>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="font-bold text-zinc-900">
            {formatPriceByLanguage((item.price * item.quantity) / 100, language)}
          </span>
          <motion.button
            onClick={() => onRemove(item.id)}
            className="text-neutral-400 hover:text-red-500 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  </div>
));

export const Checkout: React.FC = memo(() => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: '',
    paymentMethod: 'cash'
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (state.items.length === 0 && !orderComplete) {
      navigate('/productos');
    }
  }, [state.items.length, navigate, orderComplete]);

  const content = {
    es: {
      title: 'Finalizar Pedido',
      steps: {
        1: 'Revisar Pedido',
        2: 'Datos de Envío', 
        3: 'Método de Pago'
      },
      orderSummary: 'Resumen del Pedido',
      personalInfo: 'Información Personal',
      shippingInfo: 'Dirección de Envío',
      paymentMethod: 'Método de Pago',
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Correo electrónico',
      phone: 'Teléfono',
      address: 'Dirección',
      city: 'Ciudad',
      state: 'Departamento',
      zipCode: 'Código postal',
      notes: 'Notas especiales (opcional)',
      cash: 'Pago contra entrega',
      card: 'Tarjeta de crédito',
      cashDescription: 'Paga cuando recibas tu pedido',
      cardDescription: 'Disponible próximamente',
      subtotal: 'Subtotal',
      shipping: 'Envío',
      total: 'Total',
      freeShipping: 'Envío gratis',
      shippingCost: 'Q25.00',
      continue: 'Continuar',
      back: 'Regresar',
      placeOrder: 'Realizar Pedido',
      orderSuccess: '¡Pedido realizado con éxito!',
      orderNumber: 'Número de pedido',
      thankYou: 'Gracias por tu compra. Te contactaremos pronto para confirmar tu pedido.',
      backToProducts: 'Volver a Productos'
    },
    en: {
      title: 'Checkout',
      steps: {
        1: 'Review Order',
        2: 'Shipping Details',
        3: 'Payment Method'
      },
      orderSummary: 'Order Summary',
      personalInfo: 'Personal Information',
      shippingInfo: 'Shipping Address',
      paymentMethod: 'Payment Method',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      state: 'State',
      zipCode: 'ZIP code',
      notes: 'Special notes (optional)',
      cash: 'Cash on delivery',
      card: 'Credit card',
      cashDescription: 'Pay when you receive your order',
      cardDescription: 'Coming soon',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      total: 'Total',
      freeShipping: 'Free shipping',
      shippingCost: 'Q25.00',
      continue: 'Continue',
      back: 'Back',
      placeOrder: 'Place Order',
      orderSuccess: 'Order placed successfully!',
      orderNumber: 'Order number',
      thankYou: 'Thank you for your purchase. We will contact you soon to confirm your order.',
      backToProducts: 'Back to Products'
    }
  };

  const currentContent = content[i18n.language as 'es' | 'en'] || content.es;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 2) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Required';
      if (!formData.email.trim()) newErrors.email = 'Required';
      if (!formData.phone.trim()) newErrors.phone = 'Required';
      if (!formData.address.trim()) newErrors.address = 'Required';
      if (!formData.city.trim()) newErrors.city = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (currentStep < 3) {
      if (validateStep(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep || completedSteps.includes(step)) {
      setCurrentStep(step);
    }
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeItem(id);
    } else {
      updateQuantity(id, quantity);
    }
  };

  const calculateShipping = () => {
    const freeShippingThreshold = 200; // Q200
    const shippingCost = 25; // Q25
    return state.total / 100 >= freeShippingThreshold ? 0 : shippingCost;
  };

  const getFinalTotal = () => {
    const shipping = calculateShipping();
    return (state.total / 100) + shipping;
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(2)) return;

    setIsSubmitting(true);
    
    try {
      // Simular envío del pedido
      console.log('📦 Placing order:', {
        items: state.items,
        customer: formData,
        total: getFinalTotal(),
        shipping: calculateShipping()
      });

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOrderComplete(true);
      clearCart();
      
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si el pedido está completo, mostrar página de éxito
  if (orderComplete) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center bg-white p-8 rounded-3xl shadow-xl"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-black text-zinc-900 mb-4">
            {currentContent.orderSuccess}
          </h1>
          
          <p className="text-neutral-600 mb-2">
            {currentContent.orderNumber}: #BH{Date.now().toString().slice(-6)}
          </p>
          
          <p className="text-neutral-600 mb-8 leading-relaxed">
            {currentContent.thankYou}
          </p>
          
          <Link to="/productos">
            <motion.button
              className="w-full bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {currentContent.backToProducts}
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 mb-4">
            {currentContent.title}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Steps */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((step) => (
                <CheckoutStep
                  key={step}
                  stepNumber={step}
                  title={currentContent.steps[step as keyof typeof currentContent.steps]}
                  isActive={currentStep === step}
                  isCompleted={completedSteps.includes(step)}
                  onClick={() => handleStepClick(step)}
                />
              ))}
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-2xl p-6 lg:p-8">
              <AnimatePresence mode="wait">
                
                {/* Step 1: Review Order */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-zinc-900 mb-6">
                      {currentContent.steps[1]}
                    </h2>
                    
                    <div className="space-y-4">
                      {state.items.map((item) => (
                        <CartItem
                          key={item.id}
                          item={item}
                          onUpdateQuantity={handleUpdateQuantity}
                          onRemove={removeItem}
                          language={i18n.language}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Shipping Details */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-zinc-900 mb-6">
                      {currentContent.steps[2]}
                    </h2>
                    
                    <div className="space-y-6">
                      {/* Personal Info */}
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                          <User size={20} className="text-amber-600" />
                          {currentContent.personalInfo}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-zinc-900 mb-2">
                              {currentContent.firstName} *
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                                errors.firstName ? 'border-red-300' : 'border-neutral-200'
                              }`}
                            />
                            {errors.firstName && (
                              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-zinc-900 mb-2">
                              {currentContent.lastName} *
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                                errors.lastName ? 'border-red-300' : 'border-neutral-200'
                              }`}
                            />
                            {errors.lastName && (
                              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-zinc-900 mb-2">
                              {currentContent.email} *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                                errors.email ? 'border-red-300' : 'border-neutral-200'
                              }`}
                            />
                            {errors.email && (
                              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-zinc-900 mb-2">
                              {currentContent.phone} *
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                                errors.phone ? 'border-red-300' : 'border-neutral-200'
                              }`}
                            />
                            {errors.phone && (
                              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                          <MapPin size={20} className="text-amber-600" />
                          {currentContent.shippingInfo}
                        </h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-zinc-900 mb-2">
                              {currentContent.address} *
                            </label>
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                                errors.address ? 'border-red-300' : 'border-neutral-200'
                              }`}
                            />
                            {errors.address && (
                              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                                {currentContent.city} *
                              </label>
                              <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                                  errors.city ? 'border-red-300' : 'border-neutral-200'
                                }`}
                              />
                              {errors.city && (
                                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                                {currentContent.state}
                              </label>
                              <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                                {currentContent.zipCode}
                              </label>
                              <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-zinc-900 mb-2">
                              {currentContent.notes}
                            </label>
                            <textarea
                              name="notes"
                              value={formData.notes}
                              onChange={handleInputChange}
                              rows={3}
                              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                              placeholder={i18n.language === 'es' ? 'Instrucciones especiales de entrega...' : 'Special delivery instructions...'}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Payment Method */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-zinc-900 mb-6">
                      {currentContent.steps[3]}
                    </h2>
                    
                    <div className="space-y-4">
                      <motion.div
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.paymentMethod === 'cash' 
                            ? 'border-amber-500 bg-amber-50' 
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cash' }))}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formData.paymentMethod === 'cash' 
                              ? 'border-amber-500 bg-amber-500' 
                              : 'border-neutral-300'
                          }`}>
                            {formData.paymentMethod === 'cash' && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <Truck className="text-amber-600" size={24} />
                          <div>
                            <h3 className="font-bold text-zinc-900">{currentContent.cash}</h3>
                            <p className="text-sm text-neutral-600">{currentContent.cashDescription}</p>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        className="p-4 border-2 border-neutral-200 rounded-xl bg-neutral-100 opacity-50 cursor-not-allowed"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 rounded-full border-2 border-neutral-300" />
                          <CreditCard className="text-neutral-400" size={24} />
                          <div>
                            <h3 className="font-bold text-neutral-500">{currentContent.card}</h3>
                            <p className="text-sm text-neutral-400">{currentContent.cardDescription}</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-neutral-200">
                <motion.button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    currentStep === 1
                      ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                      : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                  }`}
                  whileHover={currentStep > 1 ? { scale: 1.02 } : {}}
                  whileTap={currentStep > 1 ? { scale: 0.98 } : {}}
                >
                  <ArrowLeft size={16} />
                  <span>{currentContent.back}</span>
                </motion.button>

                {currentStep < 3 ? (
                  <motion.button
                    onClick={handleContinue}
                    className="flex items-center space-x-2 bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{currentContent.continue}</span>
                    <ArrowRight size={16} />
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        <span>{currentContent.placeOrder}</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <ShoppingBag size={20} className="text-amber-600" />
                {currentContent.orderSummary}
              </h3>
              
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          (e.target as HTMLImageElement).src = '/cookies.webp';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-zinc-900 text-sm line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-neutral-600 text-sm">
                        {item.quantity} × {formatPriceByLanguage(item.price / 100, i18n.language)}
                      </p>
                    </div>
                    <span className="font-bold text-zinc-900 text-sm">
                      {formatPriceByLanguage((item.price * item.quantity) / 100, i18n.language)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-neutral-200 pt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">{currentContent.subtotal}</span>
                  <span className="font-semibold">
                    {formatPriceByLanguage(state.total / 100, i18n.language)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-600">{currentContent.shipping}</span>
                  <span className="font-semibold">
                    {calculateShipping() === 0 
                      ? currentContent.freeShipping
                      : formatPriceByLanguage(calculateShipping(), i18n.language)
                    }
                  </span>
                </div>
                
                <div className="flex justify-between text-lg font-bold text-zinc-900 pt-3 border-t border-neutral-200">
                  <span>{currentContent.total}</span>
                  <span className="text-amber-600">
                    {formatPriceByLanguage(getFinalTotal(), i18n.language)}
                  </span>
                </div>
              </div>
              
              {calculateShipping() === 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-700 text-sm flex items-center gap-2">
                    <CheckCircle size={16} />
                    {i18n.language === 'es' 
                      ? '¡Envío gratis en tu pedido!' 
                      : 'Free shipping on your order!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});