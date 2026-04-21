import { getSession } from "@/app/actions/auth";

export default async function AdminHeader() {
  const session = await getSession();
  const userName = session?.user?.name || "";
  const adminDisplayName = `Administrateur ${userName}`.trim();

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-black/5 sticky top-0 bg-admin-cream/80 backdrop-blur-md z-10">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-full max-w-md group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-admin-forest/40 group-focus-within:text-admin-primary transition-colors">search</span>
          <input className="w-full bg-white border border-black/10 rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-admin-primary focus:border-transparent transition-all outline-none text-sm placeholder:text-admin-forest/30 text-admin-forest" placeholder="Rechercher des produits, commandes ou clients..." type="text"/>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-black/5 relative text-admin-forest/60 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-admin-accent rounded-full border-2 border-admin-cream"></span>
        </button>
        <div className="h-8 w-[1px] bg-black/10 mx-2"></div>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold leading-none text-admin-forest group-hover:text-admin-primary transition-colors">{adminDisplayName}</p>
            <p className="text-[10px] text-admin-forest/40 font-bold uppercase tracking-tighter">Administrateur</p>
          </div>
          <div className="size-10 rounded-full border-2 border-admin-primary/20 p-0.5 overflow-hidden flex items-center justify-center bg-admin-sage text-white font-bold">
            {userName.charAt(0) || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
