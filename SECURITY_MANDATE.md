# Mandat de Sécurité : Standard OWASP Top 10

Désormais, toute modification apportée à ce projet (fonctionnalités, refactoring, corrections) doit impérativement respecter les directives de sécurité suivantes pour maintenir la résistance de l'application contre les attaques du **OWASP Top 10**.

## 🛡️ Principes Directeurs Obligatoires

### 1. Défense en Profondeur (A01: Broken Access Control)
- **Jamais** se fier uniquement au Middleware ou aux URLs pour la sécurité.
- **Toujours** inclure une vérification de session et de rôle (`ensureAdmin()`) à l'intérieur de chaque "Server Action" ou route API protégée.
- Vérifier systématiquement si le MFA est exigé et validé pour les accès sensibles.

### 2. Gestion Sécurisée des Secrets (A02: Cryptographic Failures)
- **Aucun** secret (clés JWT, mots de passe) ne doit être codé en dur ou posséder de "fallback" non sécurisé.
- Utiliser exclusivement des variables d'environnement fortes.
- Utiliser `bcrypt` pour le hachage des mots de passe.

### 3. Validation de Contenu (A04: Insecure Design)
- Tout téléchargement de fichier (images, documents) doit être validé par :
  - **Type MIME** (ex: `image/jpeg`).
  - **Taille maximale** (ex: 5 Mo).
  - **Assainissement** du nom de fichier.

### 4. Injection & Intégrité (A03, A08)
- Utiliser systématiquement l'ORM Prisma avec des requêtes paramétrées.
- Éviter au maximum les requêtes brutes (`$queryRaw`).
- Valider toutes les entrées utilisateur via `Zod` avant traitement.

### 5. Journalisation Sensible (A09)
- Les logs d'erreurs ne doivent jamais contenir de données personnelles (PII), de stack traces complètes du serveur, ou de JSON brut d'entrée utilisateur.

---

*Ce document sert de contrat de développement pour toute intervention future sur l'application Vegan Delights.*
