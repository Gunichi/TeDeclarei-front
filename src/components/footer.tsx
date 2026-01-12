import Link from 'next/link';
import { Heart, Instagram, Twitter, Facebook, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-bold mb-4">
              <Heart className="text-pink-500" fill="currentColor" size={28} />
              <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">Te Declarei</span>
            </Link>
            <p className="text-gray-500 max-w-md">
              Crie momentos inesquecíveis e expresse seus sentimentos mais profundos 
              com nossa encantadora coleção de cartões digitais e propostas especiais.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#features" className="text-gray-500 hover:text-pink-500 transition-colors">
                  Cartas
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-gray-500 hover:text-pink-500 transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="/#gallery" className="text-gray-500 hover:text-pink-500 transition-colors">
                  Galeria
                </Link>
              </li>
              <li>
                <Link href="/public-templates" className="text-gray-500 hover:text-pink-500 transition-colors">
                  Modelos Públicos
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-500 hover:text-pink-500 transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-pink-500 transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-pink-500 transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Te Declarei. Todos os direitos reservados.</p>
          <p className="mt-2 text-sm">
            Feito com <Heart className="inline text-pink-500" size={14} fill="currentColor" /> no Brasil
          </p>
        </div>
      </div>
    </footer>
  );
}

