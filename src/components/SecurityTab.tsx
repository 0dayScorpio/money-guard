import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Eye, Hand, Sun, ChevronDown } from 'lucide-react';
import { currencies } from '@/data/currencies';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const SecurityTab = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [selectedDenomination, setSelectedDenomination] = useState<number | null>(null);

  const currency = currencies.find(c => c.code === selectedCurrency);
  const denomination = currency?.denominations.find(d => d.value === selectedDenomination);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header with selectors */}
      <div className="p-4 bg-card border-b border-border space-y-4">
        <h2 className="text-xl font-bold">Защитни елементи</h2>
        
        <div className="flex gap-3">
          {/* Currency selector */}
          <Select value={selectedCurrency} onValueChange={(value) => {
            setSelectedCurrency(value);
            setSelectedDenomination(null);
          }}>
            <SelectTrigger className="flex-1 h-12 rounded-xl">
              <SelectValue placeholder="Избери валута" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map(c => (
                <SelectItem key={c.code} value={c.code}>
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{c.flag}</span>
                    <span>{c.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Denomination selector */}
          {currency && (
            <Select 
              value={selectedDenomination?.toString() || ''} 
              onValueChange={(value) => setSelectedDenomination(Number(value))}
            >
              <SelectTrigger className="flex-1 h-12 rounded-xl">
                <SelectValue placeholder="Номинал" />
              </SelectTrigger>
              <SelectContent>
                {currency.denominations.map(d => (
                  <SelectItem key={d.value} value={d.value.toString()}>
                    {d.value} {currency.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!selectedDenomination ? (
            // Denomination grid
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 grid grid-cols-2 gap-3"
            >
              {currency?.denominations.map((d, index) => (
                <motion.button
                  key={d.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedDenomination(d.value)}
                  className="p-4 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">
                      {d.value}{currency.symbol}
                    </span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {d.color}
                  </span>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {d.features.length} защитни елемента
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            // Feature details
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-4"
            >
              {/* Back button and header */}
              <div className="flex items-center gap-3 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDenomination(null)}
                  className="rounded-xl"
                >
                  ← Назад
                </Button>
                <div>
                  <h3 className="font-bold text-lg">
                    {selectedDenomination}{currency?.symbol} банкнота
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {denomination?.color}
                  </p>
                </div>
              </div>

              {/* Features accordion */}
              <Accordion type="single" collapsible className="space-y-3">
                {denomination?.features.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AccordionItem 
                      value={feature.id}
                      className="bg-card rounded-2xl border border-border overflow-hidden"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                            <Eye className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold">{feature.name}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4">
                          {/* Image */}
                          <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                            <img
                              src={feature.imageUrl}
                              alt={feature.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Description */}
                          <p className="text-muted-foreground">
                            {feature.description}
                          </p>

                          {/* How to check */}
                          <div className="p-4 bg-accent rounded-xl space-y-2">
                            <div className="flex items-center gap-2 font-semibold text-accent-foreground">
                              <Hand className="w-4 h-4" />
                              <span>Как да проверите</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {feature.howToCheck}
                            </p>
                          </div>

                          {/* Tips */}
                          <div className="flex gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Sun className="w-4 h-4" />
                              <span>Използвайте добра светлина</span>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
