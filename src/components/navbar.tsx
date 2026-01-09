'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Heart, 
  Menu, 
  X, 
  Plus, 
  FileText, 
  BookOpen, 
  User, 
  LogOut, 
  ChevronDown,
  Sparkles,
  LayoutGrid,
  Home,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detecta se está em uma página de criação/edição
  const isCreationPage = pathname?.startsWith('/criar') || pathname?.startsWith('/create');
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed w-full z-50 transition-all duration-500',
        isScrolled || isCreationPage || !isHomePage
          ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-pink-500/5 border-b border-pink-100/50'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-xl">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-lg bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                Te Declarei
              </span>
              <span className="text-[10px] text-gray-400 -mt-0.5 hidden sm:block">
                Compartilhe sentimentos
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {/* Navigation Pills */}
            <div className={cn(
              "flex items-center bg-gray-100/80 rounded-full p-1 mr-2",
              !isScrolled && isHomePage && "bg-white/20 backdrop-blur-sm"
            )}>
              <NavPill 
                href="/" 
                icon={<Home size={14} />} 
                label="Início" 
                isActive={pathname === '/'}
                isLight={!isScrolled && isHomePage}
              />
              {user && (
                <>
                  <NavPill 
                    href="/criar" 
                    icon={<Plus size={14} />} 
                    label="Criar" 
                    isActive={pathname === '/criar'}
                    isLight={!isScrolled && isHomePage}
                    highlight
                  />
                  <NavPill 
                    href="/templates" 
                    icon={<LayoutGrid size={14} />} 
                    label="Meus" 
                    isActive={pathname === '/templates'}
                    isLight={!isScrolled && isHomePage}
                  />
                </>
              )}
              <NavPill 
                href="/public-templates" 
                icon={<BookOpen size={14} />} 
                label="Galeria" 
                isActive={pathname === '/public-templates'}
                isLight={!isScrolled && isHomePage}
              />
            </div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "gap-2 rounded-full pl-2 pr-3 hover:bg-pink-50",
                      !isScrolled && isHomePage && "hover:bg-white/20"
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8 ring-2 ring-pink-200 ring-offset-1">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white text-sm font-medium">
                          {user.name?.[0] || user.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    <span className={cn(
                      "hidden lg:inline text-sm font-medium max-w-[100px] truncate",
                      !isScrolled && isHomePage ? "text-gray-800" : "text-gray-700"
                    )}>
                      {user.name || user.email.split('@')[0]}
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2">
                  <div className="px-2 py-3 border-b border-gray-100 mb-2">
                    <p className="font-semibold text-gray-900">{user.name || 'Usuário'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => router.push('/profile')} className="gap-2 py-2.5 rounded-lg">
                    <User size={16} className="text-gray-400" />
                    <span>Meu Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/templates')} className="gap-2 py-2.5 rounded-lg">
                    <FileText size={16} className="text-gray-400" />
                    <span>Meus Templates</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="gap-2 py-2.5 rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut size={16} />
                    <span>Sair da conta</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => router.push('/auth')}
                  className={cn(
                    "rounded-full font-medium",
                    !isScrolled && isHomePage ? "text-gray-800 hover:bg-white/20" : "text-gray-700"
                  )}
                >
                  Entrar
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => router.push('/auth')} 
                  className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg shadow-pink-500/25 font-medium"
                >
                  <Sparkles size={14} className="mr-1.5" />
                  Começar grátis
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className={cn(
              "md:hidden p-2 rounded-xl transition-colors",
              mobileMenuOpen 
                ? "bg-pink-100 text-pink-600" 
                : isScrolled || !isHomePage 
                  ? "text-gray-700 hover:bg-gray-100" 
                  : "text-gray-800 hover:bg-white/20"
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-pink-100 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              <MobileNavItem 
                href="/" 
                icon={<Home size={18} />} 
                label="Início" 
                onClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavItem 
                href="/public-templates" 
                icon={<BookOpen size={18} />} 
                label="Galeria de Modelos" 
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {user ? (
                <>
                  <div className="h-px bg-gray-100 my-3" />
                  
                  <MobileNavItem 
                    href="/criar" 
                    icon={<Plus size={18} />} 
                    label="Criar Novo" 
                    onClick={() => setMobileMenuOpen(false)}
                    highlight
                  />
                  <MobileNavItem 
                    href="/templates" 
                    icon={<FileText size={18} />} 
                    label="Meus Templates" 
                    onClick={() => setMobileMenuOpen(false)}
                  />
                  
                  <div className="h-px bg-gray-100 my-3" />
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-2">
                    <Avatar className="h-10 w-10 ring-2 ring-pink-200">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                        {user.name?.[0] || user.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{user.name || 'Usuário'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  <MobileNavItem 
                    href="/profile" 
                    icon={<User size={18} />} 
                    label="Meu Perfil" 
                    onClick={() => setMobileMenuOpen(false)}
                  />
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Sair da conta</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="h-px bg-gray-100 my-3" />
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={() => {
                        router.push('/auth');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Entrar
                    </Button>
                    <Button
                      className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600"
                      onClick={() => {
                        router.push('/auth');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Sparkles size={16} className="mr-1.5" />
                      Criar conta
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// Navigation Pill Component
function NavPill({ 
  href, 
  icon, 
  label, 
  isActive, 
  isLight,
  highlight 
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  isActive?: boolean;
  isLight?: boolean;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
        isActive 
          ? "bg-white text-pink-600 shadow-sm" 
          : highlight
            ? "text-pink-600 hover:bg-pink-50"
            : isLight
              ? "text-gray-700 hover:bg-white/30"
              : "text-gray-600 hover:bg-gray-200/50"
      )}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </Link>
  );
}

// Mobile Navigation Item
function MobileNavItem({ 
  href, 
  icon, 
  label, 
  onClick,
  highlight 
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
  highlight?: boolean;
}) {
  const router = useRouter();
  
  return (
    <button
      onClick={() => {
        router.push(href);
        onClick();
      }}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl transition-colors",
        highlight 
          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white" 
          : "text-gray-700 hover:bg-gray-50"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
