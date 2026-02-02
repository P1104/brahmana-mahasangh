"use client";

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  MoreVertical,
  Clock,
  Search,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { useChatStore, ChatSession } from '@/services/utils/dashboard/text-mode/chat-cli-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';

interface ChatHistoryProps {
  onSessionSelect?: () => void;
}

export function ChatHistory({ onSessionSelect }: ChatHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  
  const {
    sessions,
    currentSessionId,
    createNewSession,
    switchSession,
    deleteSession,
    updateSessionTitle,
  } = useChatStore();

  // Filter sessions based on search
  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.messages.some((msg) => 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Group sessions by time period
  const groupedSessions = {
    today: filteredSessions.filter((s) => isToday(s.updatedAt)),
    yesterday: filteredSessions.filter((s) => isYesterday(s.updatedAt)),
    thisWeek: filteredSessions.filter(
      (s) => !isToday(s.updatedAt) && !isYesterday(s.updatedAt) && isThisWeek(s.updatedAt)
    ),
    thisMonth: filteredSessions.filter(
      (s) => !isThisWeek(s.updatedAt) && isThisMonth(s.updatedAt)
    ),
    older: filteredSessions.filter((s) => !isThisMonth(s.updatedAt)),
  };

  const handleNewChat = () => {
    createNewSession();
    onSessionSelect?.();
  };

  const handleSelectSession = (sessionId: string) => {
    switchSession(sessionId);
    onSessionSelect?.();
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      deleteSession(sessionId);
    }
  };

  const handleStartEdit = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  const handleSaveEdit = (sessionId: string) => {
    if (editingTitle.trim()) {
      updateSessionTitle(sessionId, editingTitle.trim());
    }
    setEditingSessionId(null);
  };

  const handleCancelEdit = () => {
    setEditingSessionId(null);
    setEditingTitle('');
  };

  const formatTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else if (isThisWeek(date)) {
      return format(date, 'EEEE');
    } else {
      return format(date, 'MMM d');
    }
  };

  const renderSessionGroup = (title: string, sessions: ChatSession[]) => {
    if (sessions.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
          {title}
        </h3>
        <div className="space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => handleSelectSession(session.id)}
              className={`
                group relative px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200
                ${
                  currentSessionId === session.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
                }
              `}
            >
              <div className="flex items-start gap-2">
                <MessageSquare 
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    currentSessionId === session.id ? 'text-blue-600' : 'text-slate-400'
                  }`} 
                />
                
                <div className="flex-1 min-w-0 pr-2">
                  {editingSessionId === session.id ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(session.id);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        className="h-7 text-sm"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 flex-shrink-0"
                        onClick={() => handleSaveEdit(session.id)}
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 flex-shrink-0"
                        onClick={handleCancelEdit}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p 
                        className={`text-sm font-medium line-clamp-2 break-words ${
                          currentSessionId === session.id ? 'text-blue-900' : 'text-slate-700'
                        }`}
                        title={session.title}
                      >
                        {session.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="text-xs text-slate-500 whitespace-nowrap">
                            {formatTime(session.updatedAt)}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          • {session.messages.length} {session.messages.length === 1 ? 'message' : 'messages'}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {editingSessionId !== session.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={(e) => handleStartEdit(e, session)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleDeleteSession(e, session.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with New Chat button */}
      <div className="p-3 border-b border-slate-200 flex-shrink-0">
        <Button
          onClick={handleNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-slate-200 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Chat list with proper scrolling */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-sm text-slate-500 font-medium">
                {searchQuery ? 'No chats found' : 'No chat history yet'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {searchQuery ? 'Try a different search term' : 'Start a new chat to begin'}
              </p>
            </div>
          ) : (
            <>
              {renderSessionGroup('Today', groupedSessions.today)}
              {renderSessionGroup('Yesterday', groupedSessions.yesterday)}
              {renderSessionGroup('This Week', groupedSessions.thisWeek)}
              {renderSessionGroup('This Month', groupedSessions.thisMonth)}
              {renderSessionGroup('Older', groupedSessions.older)}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}