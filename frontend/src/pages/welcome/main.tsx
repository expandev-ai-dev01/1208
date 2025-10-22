/**
 * @page WelcomePage
 * @summary Welcome page for unauthenticated users
 * @domain core
 * @type landing-page
 * @category public
 */

import { Link } from 'react-router-dom';
import { Button } from '@/core/components/Button';
import { Card } from '@/core/components/Card';
import { CheckSquare, BarChart3, Bell, Settings } from 'lucide-react';

const features = [
  {
    icon: CheckSquare,
    title: 'Cadastro de Hábitos',
    description:
      'Crie e gerencie seus hábitos com facilidade, definindo frequência e horários ideais.',
  },
  {
    icon: BarChart3,
    title: 'Estatísticas Detalhadas',
    description: 'Acompanhe seu progresso com gráficos e estatísticas de consistência.',
  },
  {
    icon: Bell,
    title: 'Lembretes Inteligentes',
    description: 'Receba notificações nos horários programados para não esquecer seus hábitos.',
  },
  {
    icon: Settings,
    title: 'Personalização Completa',
    description: 'Organize seus hábitos em categorias e personalize suas preferências.',
  },
];

export const WelcomePage = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Desenvolva Hábitos Saudáveis</h1>
        <p className="text-xl text-gray-600 mb-8">
          Transforme sua rotina com o Gerenciador de Hábitos
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/auth/register">
            <Button variant="primary" size="large">
              Começar Agora
            </Button>
          </Link>
          <Link to="/auth/login">
            <Button variant="outline" size="large">
              Já tenho conta
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {features.map((feature, index) => (
          <Card key={index} padding="large">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card padding="large" className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Pronto para começar?</h2>
        <p className="text-gray-600 mb-6">
          Junte-se a milhares de pessoas que estão transformando suas vidas através de hábitos
          saudáveis.
        </p>
        <Link to="/auth/register">
          <Button variant="primary" size="large">
            Criar Conta Gratuita
          </Button>
        </Link>
      </Card>
    </div>
  );
};
