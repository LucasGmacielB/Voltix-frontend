"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { IoPersonCircle, IoLocationSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {updateProfile, changePassword,} from "@/services/authService";
import { Logo } from "@/components/logo/Logo";

export default function ProfilePage() {
  const router = useRouter();
  

  const user = useAuthStore((state) => state.user);
  const basicAuth = useAuthStore((state) => state.basicAuth);

  console.log("USER:", user);
  console.log("AUTH:", basicAuth);
  const logout = useAuthStore((state) => state.logout);

  const updateUser = useAuthStore((state) => state.updateUser);

const [editOpen, setEditOpen] = useState(false);
const [passwordOpen, setPasswordOpen] = useState(false);

const [name, setName] = useState(user?.name ?? "");
const [email, setEmail] = useState(user?.email ?? "");

const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");

  function handleLogout() {
    logout();
    router.push("/login");
  }

  async function handleUpdateProfile() {
  if (!user) return;

  try {
    const updatedUser = await updateProfile({
      id: user.id,
      name,
      email,
    });

    updateUser(updatedUser);

    alert("Perfil atualizado com sucesso!");
    setEditOpen(false);
  } catch (error) {
    console.error(error);
    alert("Erro ao atualizar perfil");
  }
}

async function handleChangePassword() {
  if (!user) return;

  try {
    await changePassword({
      id: user.id,
      currentPassword,
      newPassword,
    });

    alert("Senha alterada com sucesso!");

    setCurrentPassword("");
    setNewPassword("");
    setPasswordOpen(false);
  } catch (error) {
    console.error(error);
    alert("Senha atual incorreta");
  }
}

  return (
    <main className="min-h-screen bg-[linear-gradient(to_bottom,#000000_0%,#111111_60%,#d1d5db_85%,#ffffff_100%)]">
      <div className="max-w-6xl mx-auto px-6 py-10">
      <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-zinc-800 pb-4 mb-10">
       <Logo />

     <div className="flex items-center gap-6">
      <button
      onClick={() => router.push("/products")}
      className="text-sm text-zinc-300 transition hover:text-green-400 hidden sm:block">
      Catálogo
    </button>

    <button
      onClick={() => router.push("/profile")}
      className="flex items-center gap-2 text-zinc-300 hover:text-green-400 transition"
    >
      <IoPersonCircle className="text-2xl" />
      <span className="text-xs font-medium hidden md:inline">
        Minha Conta
      </span>
      </button>
      </div>
     </header>

      <div className="bg-[#2b2e33] border border-[#3a3d42] rounded-3xl p-8">        
      <div className="flex flex-col md:flex-row md:items-center gap-6">
            <IoPersonCircle className="text-[120px] text-[#22C55E]" />

            <div>
              <h2 className="text-4xl font-bold">
                {user?.name ?? "Usuário"}
              </h2>

              <p className="text-slate-400 mt-2">
                {user?.email ?? "Nenhum usuário autenticado"}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <div className="bg-[#35383d] border border-[#45484d] shadow-[0_0_20px_rgba(0,0,0,0.25)] rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-5 text-white">
                Dados do Usuário
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm">ID</p>
                  <p className="font-medium">{user?.id ?? "--"}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">Nome</p>
                  <p className="font-medium">
                    {user?.name ?? "--"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">Email</p>
                  <p className="font-medium">
                    {user?.email ?? "--"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#35383d] border border-[#45484d] shadow-[0_0_20px_rgba(0,0,0,0.25)] rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-5 text-white">
                Endereços
              </h3>

              <div className="flex items-center gap-3 mb-6">
                <IoLocationSharp className="text-[#22C55E] text-2xl" />

                <span className="text-slate-300">
                  Gerencie seus endereços cadastrados
                </span>
              </div>

              <button
                onClick={() => router.push("/addresses")}
                className="w-full border border-[#334155] bg-[#1E293B] rounded-xl py-3 hover:bg-[#334155] transition-all duration-300 font-medium"
              >
                Gerenciar Endereços
              </button>
            </div>

            <div className="bg-[#35383d] border border-[#45484d] shadow-[0_0_20px_rgba(0,0,0,0.25)] rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-5 text-white">
                Configurações
              </h3>

              <div className="space-y-3">
               <button onClick={() => setEditOpen(true)} className="w-full border border-[#334155] bg-[#1E293B] rounded-xl py-3 hover:bg-[#334155] transition-all duration-300 font-medium"
                >Editar Perfil
                </button>

               <button onClick={() => setPasswordOpen(true)} className="w-full border border-[#334155] bg-[#1E293B] rounded-xl py-3 hover:bg-[#334155] transition-all duration-300 font-medium"
            >Alterar Senha
              </button>
              </div>
            </div>

            <div className="bg-[#35383d] border border-[#45484d] shadow-[0_0_20px_rgba(0,0,0,0.25)] rounded-2xl p-6 flex flex-col justify-center">
              <h3 className="text-xl font-semibold mb-5 text-white">
                Sessão
              </h3>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-500 transition-all duration-300 rounded-xl py-3 font-semibold shadow-lg"
              >
                Sair da Conta
              </button>
            </div>
          </div>
        </div>
      </div>
      {editOpen && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div className= "bg-slate-900/95 p-6 rounded-3xl w-[400px] border border-slate-800">
      <h2 className="text-xl font-bold mb-4">
        Editar Perfil
      </h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome"
        className="w-full mb-3 p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-green-500"
      />

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full mb-4 p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-green-500"
      />

      <div className="flex gap-3">
        <button
          onClick={handleUpdateProfile}
          className="flex-1 bg-bg-[#16A34A] hover:bg-green-500 transition-all duration-200 rounded-xl py-2 font-semibold"
        >
          Salvar
        </button>

        <button
          onClick={() => setEditOpen(false)}
          className="flex-1 bg-red-600 hover:bg-red-500 transition-all duration-200 rounded-xl py-2 font-semibold"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}
{passwordOpen && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div className="bg-slate-900 p-6 rounded-2xl w-[400px] border border-slate-700">
      <h2 className="text-xl font-bold mb-4">
        Alterar Senha
      </h2>

      <input
        type="password"
        placeholder="Senha atual"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full mb-3 p-3 rounded bg-slate-800"
      />

      <input
        type="password"
        placeholder="Nova senha"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full mb-4 p-3 rounded bg-slate-800"
      />

      <div className="flex gap-3">
        <button
          onClick={handleChangePassword}
          className="flex-1 bg-[#16A34A] rounded py-2"
        >
          Salvar
        </button>

        <button
          onClick={() => setPasswordOpen(false)}
          className="flex-1 bg-red-600 rounded py-2"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}