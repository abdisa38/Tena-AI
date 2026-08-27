import { Globe, Check, Languages } from 'lucide-react';
import Card from '@components/ui/Card';
import { clsx } from 'clsx';

const LanguageSelector = ({ selected, onSelect }) => {
  const languages = [
    {
      code: 'english',
      name: 'English',
      nativeName: 'English',
      description: 'Record your symptoms in English'
    },
    {
      code: 'amharic',
      name: 'Amharic',
      nativeName: 'አማርኛ',
      description: 'Record your symptoms in Amharic'
    },
    {
      code: 'afaan_oromoo',
      name: 'Afaan Oromoo',
      nativeName: 'Afaan Oromoo',
      description: 'Record your symptoms in Afaan Oromoo'
    }
  ];

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          <Card.Title>Choose Language</Card.Title>
        </div>
        <Card.Description>
          Select your preferred language for recording
        </Card.Description>
      </Card.Header>
      
      <Card.Content>
        <div className="grid md:grid-cols-3 gap-4">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => onSelect(language.code)}
              className={clsx(
                'relative p-4 rounded-lg border-2 transition-all duration-200 text-left',
                selected === language.code
                  ? 'border-tena-yellow bg-yellow-50'
                  : 'border-cloud-gray hover:border-gray-300'
              )}
            >
              {selected === language.code && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-tena-yellow rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-tena-black" />
                </div>
              )}
              
              <div className="mb-3">
                <Languages className="w-12 h-12 text-tena-yellow" />
              </div>
              <h3 className="font-semibold text-tena-black mb-1">
                {language.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {language.nativeName}
              </p>
              <p className="text-xs text-gray-500">
                {language.description}
              </p>
            </button>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
};

export default LanguageSelector;
