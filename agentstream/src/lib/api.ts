import { Stream } from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function fetchStreams(): Promise<Stream[]> {
  const response = await fetch(`${API_URL}/streams`);
  if (!response.ok) {
    throw new Error("Failed to fetch streams");
  }
  const data = await response.json();
  
  // Transform backend data to frontend Stream type if necessary
  // For now, assuming backend returns data that matches key fields or we map them
  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    agentId: item.agentId || "1", // Default for now
    agentName: item.agentName || "Unknown Agent",
    agentAvatar: item.agentAvatar || `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${item.agentName}`,
    category: item.category || "General",
    viewers: item.viewerCount || 0,
    thumbnail: item.thumbnail,
    isLive: item.isLive,
    startedAt: new Date().toISOString(), // Mock for now
    tags: [],
    playbackId: item.playbackId
  }));
}

export async function fetchStreamById(id: string): Promise<Stream | null> {
  const response = await fetch(`${API_URL}/streams/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error("Failed to fetch stream");
  }
  const item = await response.json();
  
  return {
    id: item.id,
    title: item.title,
    agentId: item.agentId || "1",
    agentName: item.agentName || "Unknown Agent",
    agentAvatar: item.agentAvatar || `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${item.agentName}`,
    category: item.category || "General",
    viewers: item.viewerCount || 0,
    thumbnail: item.thumbnail,
    isLive: item.isLive,
    startedAt: new Date().toISOString(),
    tags: [],
    playbackId: item.playbackId
  };
}
