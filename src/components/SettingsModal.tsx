import React, { useState } from 'react';
import { GitHubConfig, SyncStatus } from '../types';
import {
  X,
  Github,
  ExternalLink,
  Check,
  Copy,
  RotateCw,
  HelpCircle,
  Radio,
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { getGitHubEditUrl, getGitHubRepoUrl, getGitHubRawUrl } from '../services/githubService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GitHubConfig;
  onSaveConfig: (newConfig: GitHubConfig) => void;
  onTestConnection: () => Promise<void>;
  syncStatus: SyncStatus;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onTestConnection,
  syncStatus
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'guide' | 'json'>('config');
  const [formData, setFormData] = useState<GitHubConfig>({ ...config });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleTest = async () => {
    setIsTesting(true);
    onSaveConfig(formData);
    await onTestConnection();
    setIsTesting(false);
  };

  const sampleJsonCode = `[
  {
    "id": "entry-${Date.now()}",
    "timestamp": "${new Date().toISOString()}",
    "content": "Buraya tweet gibi düşünceni yazıyorsun...",
    "category": "dev"
  }
]`;

  const copySampleJson = () => {
    navigator.clipboard.writeText(sampleJsonCode);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#15171c] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-neutral-800/80 text-white">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">GitHub Senkronizasyon Ayarları</h2>
              <p className="text-xs text-neutral-400 font-mono-meta">
                Veriler doğrudan GitHub'dan çekilir ve sitede gösterilir
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="px-6 pt-3 border-b border-neutral-800/60 flex gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'config'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Repo Bilgileri
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'guide'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Nasıl Çalışır & Netlify Rehberi
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'json'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Örnek entries.json
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {activeTab === 'config' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    GitHub Kullanıcı Adı (Owner)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    placeholder="örnek: ogulgnyy"
                    className="w-full px-3 py-2 bg-[#1b1e24] border border-neutral-700/80 rounded-lg text-white text-sm focus:outline-none focus:border-neutral-500 font-mono-meta text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Depo Adı (Repository)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.repo}
                    onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                    placeholder="örnek: microblog"
                    className="w-full px-3 py-2 bg-[#1b1e24] border border-neutral-700/80 rounded-lg text-white text-sm focus:outline-none focus:border-neutral-500 font-mono-meta text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Dal (Branch)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    placeholder="main veya master"
                    className="w-full px-3 py-2 bg-[#1b1e24] border border-neutral-700/80 rounded-lg text-white text-sm focus:outline-none focus:border-neutral-500 font-mono-meta text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    JSON Dosya Yolu
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.path}
                    onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                    placeholder="entries.json"
                    className="w-full px-3 py-2 bg-[#1b1e24] border border-neutral-700/80 rounded-lg text-white text-sm focus:outline-none focus:border-neutral-500 font-mono-meta text-xs"
                  />
                </div>
              </div>

              {/* Private repo personal access token (optional) */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  GitHub Personal Access Token (İsteğe Bağlı)
                </label>
                <input
                  type="password"
                  value={formData.token || ''}
                  onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                  placeholder="Yalnızca gizli (private) re polar için gereklidir (ghp_...)"
                  className="w-full px-3 py-2 bg-[#1b1e24] border border-neutral-700/80 rounded-lg text-white text-sm focus:outline-none focus:border-neutral-500 font-mono-meta text-xs"
                />
                <p className="mt-1 text-[11px] text-neutral-500">
                  Genel (public) GitHub depolarında token gerekmez.
                </p>
              </div>

              {/* Auto sync settings */}
              <div className="p-3.5 rounded-xl bg-[#1b1e24] border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-neutral-200 block">
                    Otomatik Senkronizasyon (Canlı Güncelleme)
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono-meta">
                    Her 60 saniyede bir GitHub'daki değişiklikleri kontrol eder
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoSync}
                  onChange={(e) => setFormData({ ...formData, autoSync: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-neutral-900 border-neutral-700 cursor-pointer"
                />
              </div>

              {/* Current Status Box */}
              <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs">
                <div className="flex items-center justify-between mb-1.5 font-mono-meta">
                  <span className="text-neutral-400">Aktif Veri Kaynağı:</span>
                  <span
                    className={
                      syncStatus.source === 'github'
                        ? 'text-emerald-400 font-medium'
                        : 'text-amber-400 font-medium'
                    }
                  >
                    {syncStatus.source === 'github'
                      ? '● GitHub Raw'
                      : syncStatus.source === 'local'
                      ? '● Yerel /entries.json'
                      : '● Örnek Veri'}
                  </span>
                </div>
                {syncStatus.lastSyncedAt && (
                  <div className="text-[11px] text-neutral-500 font-mono-meta">
                    Son Kontrol:{' '}
                    {syncStatus.lastSyncedAt.toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </div>
                )}
                {syncStatus.errorMessage && (
                  <p className="text-xs text-rose-400 mt-1">{syncStatus.errorMessage}</p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto flex-1 py-2 px-4 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Kaydedildi</span>
                    </>
                  ) : (
                    'Ayarları Kaydet'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleTest}
                  disabled={isTesting}
                  className="w-full sm:w-auto py-2 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium rounded-lg transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>Bağlantıyı Test Et</span>
                </button>

                {formData.owner && formData.repo && (
                  <a
                    href={getGitHubEditUrl(formData)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-2 px-3 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors"
                    title="GitHub'da entries.json dosyasını düzenle"
                  >
                    <span>GitHub'da Düzenle</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </form>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-neutral-300 leading-relaxed">
              {/* Direct ZIP download box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 to-neutral-900 border border-blue-900/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-400" />
                    Tüm Proje Dosyalarını İndirin
                  </h4>
                  <a
                    href="/ogulr-microblog.zip"
                    download="ogulr-microblog.zip"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow"
                  >
                    <span>Projeyi İndir (.ZIP)</span>
                  </a>
                </div>
                <p className="text-neutral-300 text-[11px]">
                  Bu zip dosyası; sitenin tüm kodlarını, Netlify ayarlarını (<code>netlify.toml</code>) ve örnek <code>entries.json</code> dosyasını içerir.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1b1e24] border border-neutral-800 space-y-2">
                <h4 className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold">
                    1
                  </span>
                  GitHub'da Depo Açma (Issue DEĞİL, Repository)
                </h4>
                <p>
                  GitHub'da <strong>kesinlikle "Issue" oluşturmayın</strong>; Issue hata/sorun bildirimidir, dosya tutmaz.
                </p>
                <p>
                  Sağ üstteki <strong>`+` butonuna basıp "New repository"</strong> deyin.
                  İsim yazın (örn: <code>ogulr-blog</code>), <strong>Public</strong> seçin ve <strong>"Add a README file"</strong> kutucuğunu İŞARETLEYİN (bu sayede repo boş kalmaz ve butonlar hemen görünür).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1b1e24] border border-neutral-800 space-y-2">
                <h4 className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold">
                    2
                  </span>
                  Dosyaları Yükleme (Sürükle - Bırak)
                </h4>
                <p>
                  İndirdiğiniz <code>ogulr-microblog.zip</code> dosyasını bilgisayarınızda bir klasöre çıkartın.
                </p>
                <p>
                  GitHub reponuzun sayfasında <strong>"Add file" &gt; "Upload files"</strong> butonuna tıklayın ve çıkarttığınız klasörün içindeki tüm dosyaları tarayıcıya sürükleyip bırakın. En alttaki yeşil <strong>"Commit changes"</strong> butonuna basın.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1b1e24] border border-neutral-800 space-y-2">
                <h4 className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#00c7b7] text-black flex items-center justify-center text-[10px] font-bold">
                    3
                  </span>
                  Netlify'a Bağlama (Tek Tıkla Canlıya Alma)
                </h4>
                <p>
                  <strong>netlify.com</strong>'a gidip GitHub ile giriş yapın. <strong>"Add new site" &gt; "Import an existing project"</strong> seçeneğine tıklayın.
                </p>
                <p>
                  GitHub'daki reponuzu seçin. Projedeki <code>netlify.toml</code> sayesinde ayarlar hazırdır; sadece <strong>"Deploy site"</strong> butonuna basın!
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1b1e24] border border-neutral-800 space-y-2">
                <h4 className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px] font-bold">
                    4
                  </span>
                  Yeni Tweet / Entry Ekleme
                </h4>
                <p>
                  GitHub reponuzda <code>entries.json</code> dosyasına tıklayın, sağ üstteki <strong>kalem (Edit)</strong> simgesine basın, listenin en başına yeni düşüncenizi ekleyip <strong>Commit</strong> deyin. Siteniz saniyeler içinde anında güncellenir!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>GitHub'daki dosyanızın içereceği format:</span>
                <button
                  onClick={copySampleJson}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer text-xs"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Formatı Kopyala</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-black/60 border border-neutral-800 text-neutral-200 text-xs font-mono-meta overflow-x-auto">
                {sampleJsonCode}
              </pre>

              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
                <p><strong>id:</strong> Benzersiz bir metin veya sayı (örn: "entry-1")</p>
                <p><strong>timestamp:</strong> ISO 8601 tarih formatı (örn: "2026-10-24T10:40:00Z")</p>
                <p><strong>content:</strong> Düşünceniz / tweet metniniz</p>
                <p><strong>category:</strong> İsteğe bağlı ("dev", "music", "design", "thoughts" vb.)</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
