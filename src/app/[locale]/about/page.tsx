import { useTranslations } from 'next-intl';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-20 py-24 leading-relaxed">
      <div className="max-w-3xl">
        <h1 className="font-serif text-6xl font-black text-forest-green dark:text-soft-cream mb-12">
          Notre Mission
        </h1>
        <div className="space-y-8 text-lg text-forest-green/70 dark:text-soft-cream/70">
          <p className="font-medium text-2xl text-forest-green dark:text-soft-cream italic border-l-4 border-primary pl-8 py-4 bg-primary/5 rounded-r-2xl">
            "Redéfinir le gastronomie végétale avec élégance, éthique et plaisir."
          </p>
          <p>
            Vegan Delights est né d'une passion pour la cuisine d'excellence et d'un engagement profond envers la vie sous toutes ses formes. Notre plateforme unique regroupe le meilleur de la restauration végétale et une boutique haut de gamme.
          </p>
          <p>
            Que vous soyez à la recherche d'un repas chaud nutritif ou de produits d'exception pour votre propre cuisine, nous avons sélectionné chaque article pour sa qualité artisanale et son impact positif.
          </p>
          
          <div className="pt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-forest-green dark:text-soft-cream">Le Restaurant</h3>
              <p className="text-sm">Une cuisine vivante, des menus du jour créatifs et des plats sains préparés avec amour pour votre bien-être quotidien.</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-forest-green dark:text-soft-cream">La Boutique</h3>
              <p className="text-sm">La première boucherie végétale premium et une épicerie fine sourcée auprès des meilleurs producteurs éthiques.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
