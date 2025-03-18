import { useState } from 'react';
import { BookingDialog } from './components/BookingDialog';
import type { Language } from './types/booking';
import { CircleFadingPlus } from 'lucide-react';

interface AppProps {
  buttonText?: string;
  language?: string;
}

function App({
  buttonText = 'Book Now',
  language: rawLanguage = 'en',
}: AppProps) {
  const language = rawLanguage as Language;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    window.parent.postMessage('dialogOpen', '*');
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    window.parent.postMessage('dialogClose', '*');
  };

  return (
    <div className='inline-block'>
      <button
        onClick={handleOpenDialog}
        className='bg-black text-white px-[19px] py-[14px] rounded-[5px] border-[1px] border-[#fff] hover:bg-blue-700 transition-colors flex flex-row gap-2 font-medium text-[15px]'
      >
        <CircleFadingPlus />
        {buttonText}
      </button>

      {isDialogOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <BookingDialog
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
            language={language}
          />
        </div>
      )}
    </div>
  );
}

export default App;
