'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Camera, Loader2, Save, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth-context';
import { usersApi, uploadsApi } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, isLoading: authLoading, updateUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!token) return;

    try {
      setSaving(true);
      const updatedUser = await usersApi.updateProfile(token, { name });
      updateUser(updatedUser);
      alert('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    try {
      setUploadingAvatar(true);
      const result = await uploadsApi.upload(token, file, 'avatars');
      const avatarUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${result.url}`;
      const updatedUser = await usersApi.updateProfile(token, { avatar: avatarUrl });
      updateUser(updatedUser);
    } catch (err) {
      console.error(err);
      alert('Erro ao fazer upload da imagem');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!token) return;

    try {
      await usersApi.deleteAccount(token);
      logout();
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir conta');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 to-blue-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-20 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="text-center">
              <div className="relative mx-auto mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl">
                    {user?.name?.[0] || user?.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50">
                  {uploadingAvatar ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </label>
              </div>
              <CardTitle className="text-2xl">{user?.name || 'Meu Perfil'}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <Input value={user?.email || ''} disabled className="bg-gray-50" />
                <p className="text-xs text-gray-500">O email não pode ser alterado</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  className="flex-1"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Salvar Alterações
                </Button>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-red-600 mb-2">Zona de Perigo</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Ao desativar sua conta, você perderá acesso a todos os seus templates.
                  Esta ação pode ser revertida entrando em contato com o suporte.
                </p>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Desativar Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desativar conta?</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja desativar sua conta? Você perderá acesso a todos os seus templates.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Desativar Conta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

