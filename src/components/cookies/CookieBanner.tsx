import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const COOKIE_CONSENT_KEY = "eclat_cookie_consent";
const COOKIE_PREFERENCES_KEY = "eclat_cookie_preferences";

export const getCookieConsent = (): boolean | null => {
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  return consent ? JSON.parse(consent) : null;
};

export const getCookiePreferences = (): CookiePreferences => {
  const prefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);
  return prefs ? JSON.parse(prefs) : DEFAULT_PREFERENCES;
};

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const consent = getCookieConsent();
    if (consent === null) {
      setIsVisible(true);
    } else {
      setPreferences(getCookiePreferences());
    }
  }, []);

  const saveConsent = (accepted: boolean, prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(accepted));
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    saveConsent(true, allAccepted);
  };

  const handleRefuseAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(onlyNecessary);
    saveConsent(false, onlyNecessary);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences.analytics || preferences.marketing, preferences);
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          >
            <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-4 md:p-6 shadow-xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Cookie className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">
                      Nous utilisons des cookies 🍪
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic 
                      et personnaliser le contenu. Vous pouvez accepter, refuser ou gérer vos préférences.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row md:shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreferences(true)}
                    className="gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Préférences
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefuseAll}
                  >
                    Refuser
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                  >
                    Accepter tout
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <a href="/confidentialite" className="hover:text-foreground hover:underline">
                  Politique de confidentialité
                </a>
                <a href="/cgu" className="hover:text-foreground hover:underline">
                  Conditions d'utilisation
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Préférences de cookies
            </DialogTitle>
            <DialogDescription>
              Personnalisez vos préférences de cookies. Les cookies nécessaires sont toujours actifs.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
              <div className="space-y-0.5">
                <Label className="font-medium">Cookies nécessaires</Label>
                <p className="text-xs text-muted-foreground">
                  Essentiels au fonctionnement du site. Ne peuvent pas être désactivés.
                </p>
              </div>
              <Switch checked disabled className="opacity-50" />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <Label className="font-medium">Cookies analytiques</Label>
                <p className="text-xs text-muted-foreground">
                  Nous aident à comprendre comment vous utilisez le site pour l'améliorer.
                </p>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, analytics: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <Label className="font-medium">Cookies marketing</Label>
                <p className="text-xs text-muted-foreground">
                  Utilisés pour vous proposer des contenus personnalisés.
                </p>
              </div>
              <Switch
                checked={preferences.marketing}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, marketing: checked })
                }
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleRefuseAll}
            >
              Tout refuser
            </Button>
            <Button
              className="flex-1"
              onClick={handleSavePreferences}
            >
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
