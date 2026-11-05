import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, X, Search, Calendar, ChevronRight } from 'lucide-react';
import { Conversation } from '../types/chat';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  currentConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onClearAllConversations: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onClearAllConversations,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-80 bg-white border-r border-slate-200 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-xl lg:shadow-none`}
      >
        {/* Top Header of Sidebar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
              વા
            </div>
            <span className="font-bold text-sm text-slate-900">વાતચીત ઇતિહાસ</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            title="બંધ કરો"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action: New Chat Button inside Sidebar */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewConversation();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>નવી વાતચીત શરૂ કરો</span>
          </button>
        </div>

        {/* Search Conversations */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="વાતચીત શોધો..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-400 text-xs">
              {searchTerm ? 'કોઈ મળતી વાતચીત મળી નથી.' : 'હજુ સુધી કોઈ જૂની વાતચીત સંગ્રહાયેલ નથી.'}
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = conv.id === currentConversationId;
              const dateStr = new Date(conv.updatedAt).toLocaleDateString('gu-IN', {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={conv.id}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200/80 shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                  }`}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    onClose();
                  }}
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1 pr-2">
                    <MessageSquare className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs">{conv.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-normal">
                        <span>{dateStr}</span>
                        <span>·</span>
                        <span>{conv.messages.length} સંદેશ</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 rounded-md transition-opacity"
                    title="આ વાતચીત ભૂંસી નાખો"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Options: Clear All */}
        {conversations.length > 0 && (
          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            {showClearConfirm ? (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-center">
                <p className="text-xs text-red-800 font-semibold mb-2">
                  બધી વાતચીત કાયમ માટે ભૂંસી નાખવી છે?
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      onClearAllConversations();
                      setShowClearConfirm(false);
                    }}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    હા, ભૂંસો
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    રદ કરો
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>બધી વાતચીત ભૂંસી નાખો</span>
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
};
