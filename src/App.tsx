import { useState } from 'react';
import { BookingDialog } from './components/BookingDialog';
import type { Language } from './types/booking';

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
        className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
      >
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
