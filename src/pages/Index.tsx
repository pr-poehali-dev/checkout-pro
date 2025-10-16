import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [agreed, setAgreed] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const { toast } = useToast();

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreed) {
      toast({
        title: "Требуется согласие",
        description: "Пожалуйста, примите условия оплаты",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === 'card' && (!cardNumber || !expiryDate || !cvv)) {
      toast({
        title: "Заполните все поля",
        description: "Введите данные карты для продолжения",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Оплата обрабатывается",
      description: "Ваша подписка скоро будет активирована",
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-start">
        <div className="w-full">
          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-secondary"
                  onClick={() => window.history.back()}
                >
                  <Icon name="ArrowLeft" size={20} />
                </Button>
                <CardTitle className="text-3xl font-semibold">Подписаться</CardTitle>
              </div>
              <CardDescription className="text-base">
                Выберите способ оплаты и завершите подписку
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Способ оплаты</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground/30'
                    }`}
                  >
                    <Icon name="CreditCard" size={20} />
                    <span className="font-medium">Карта</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'paypal'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground/30'
                    }`}
                  >
                    <Icon name="Wallet" size={20} />
                    <span className="font-medium">PayPal</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-sm font-medium">
                      Номер карты
                    </Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="h-12 text-base"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-sm font-medium">
                        Срок действия
                      </Label>
                      <Input
                        id="expiry"
                        placeholder="ММ/ГГ"
                        value={expiryDate}
                        onChange={handleExpiryChange}
                        className="h-12 text-base"
                        maxLength={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-sm font-medium">
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={cvv}
                        onChange={handleCvvChange}
                        className="h-12 text-base"
                        maxLength={3}
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <Checkbox
                      id="terms"
                      checked={agreed}
                      onCheckedChange={(checked) => setAgreed(checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                      Я принимаю условия оплаты и соглашаюсь с автоматическим продлением подписки
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold"
                    size="lg"
                  >
                    Подтвердить оплату
                  </Button>
                </form>
              )}

              {paymentMethod === 'paypal' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-start gap-3 pt-2">
                    <Checkbox
                      id="terms-paypal"
                      checked={agreed}
                      onCheckedChange={(checked) => setAgreed(checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="terms-paypal" className="text-sm leading-relaxed cursor-pointer">
                      Я принимаю условия оплаты и соглашаюсь с автоматическим продлением подписки
                    </Label>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full h-12 text-base font-semibold bg-[#0070BA] hover:bg-[#005ea6]"
                    size="lg"
                  >
                    <Icon name="Wallet" size={20} className="mr-2" />
                    Оплатить через PayPal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:sticky lg:top-8">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Детали подписки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <h3 className="text-2xl font-bold">Pro</h3>
                    <p className="text-sm text-muted-foreground mt-1">Профессиональный план</p>
                  </div>
                  <Icon name="Zap" size={32} className="text-primary" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-base">
                    <span className="text-muted-foreground">Стоимость</span>
                    <span className="font-medium">$9.99</span>
                  </div>

                  <div className="flex items-center justify-between text-base">
                    <span className="text-accent font-medium">Скидка</span>
                    <span className="text-accent font-semibold">-$2.00</span>
                  </div>

                  <div className="h-px bg-border my-2"></div>

                  <div className="flex items-center justify-between text-lg pt-2">
                    <span className="font-semibold">Итого</span>
                    <span className="text-3xl font-bold text-primary">$7.99</span>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <Icon name="Shield" size={18} className="text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Защищенная оплата с 256-битным шифрованием
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="RefreshCcw" size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Автоматическое продление каждый месяц
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={18} className="text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Отмена в любое время без штрафов
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
