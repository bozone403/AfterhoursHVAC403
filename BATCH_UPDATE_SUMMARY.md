# BATCH UPDATE - Payment Buttons on All Shop Pages

## Remaining Pages to Update:
1. /shop/furnaces
2. /shop/air-conditioning  
3. /shop/water-heaters
4. /shop/addons-extras
5. /shop/maintenance-plans

## Pattern to Apply:
Each page needs:
```tsx
import { useState } from 'react';
import { ServiceBookingModal } from '@/components/ServiceBookingModal';
import { ShoppingCart } from 'lucide-react';

const [bookingModalOpen, setBookingModalOpen] = useState(false);
const [selectedService, setSelectedService] = useState<any>(null);

const handleBookService = (item) => {
  setSelectedService({
    name: item.name,
    price: item.price,
    description: item.description,
    category: 'Category Name'
  });
  setBookingModalOpen(true);
};

// Replace buttons with:
<Button onClick={() => handleBookService(item)}>
  <ShoppingCart className="w-4 h-4 mr-2" />
  Book Now
</Button>

// Add modal before closing tag:
{selectedService && (
  <ServiceBookingModal
    isOpen={bookingModalOpen}
    onClose={() => setBookingModalOpen(false)}
    service={selectedService}
  />
)}
```

## Updating now...
