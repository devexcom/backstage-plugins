import { Entity } from '@backstage/catalog-model';
import { EntityMetadata } from '../types';

/**
 * Extract display metadata from an entity
 */
export function extractEntityMetadata(entity: Entity): EntityMetadata {
  const { metadata, spec = {}, relations = [] } = entity;
  
  // Get title with fallback to name
  const title = metadata.title || metadata.name;
  
  // Extract owner information
  const owner = typeof spec.owner === 'string' ? spec.owner : undefined;
  
  // Check for TechDocs
  const hasTechDocs = !!(
    metadata.annotations?.['backstage.io/techdocs-ref'] ||
    metadata.annotations?.['backstage.io/techdocs-entity']
  );
  
  // Count API relations
  const apiCount = relations.filter(
    rel => rel.targetRef.startsWith('api:') || rel.type === 'apiProvidedBy' || rel.type === 'apiConsumedBy'
  ).length;
  
  // Get source URL
  const sourceUrl = metadata.annotations?.['backstage.io/source-location'] ||
    metadata.annotations?.['github.com/project-slug'] &&
    `https://github.com/${metadata.annotations['github.com/project-slug']}`;
  
  // Get last updated
  const lastUpdated = metadata.annotations?.['backstage.io/last-updated'];
  
  return {
    title,
    name: metadata.name,
    namespace: metadata.namespace || 'default',
    description: metadata.description,
    tags: metadata.tags || [],
    owner,
    type: spec.type as string,
    system: spec.system as string,
    lifecycle: spec.lifecycle as string,
    hasTechDocs,
    apiCount,
    isStarred: false, // Will be determined by StarredEntitiesApi
    lastUpdated,
    sourceUrl,
  };
}

/**
 * Get display name for entity type
 */
export function getEntityTypeDisplayName(kind: string, type?: string): string {
  if (type) {
    return `${kind} (${type})`;
  }
  return kind;
}

/**
 * Get color for entity lifecycle
 */
export function getLifecycleColor(lifecycle?: string): 'primary' | 'secondary' | 'default' | 'error' {
  switch (lifecycle?.toLowerCase()) {
    case 'experimental':
      return 'secondary';
    case 'production':
      return 'primary';
    case 'deprecated':
      return 'error';
    default:
      return 'default';
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '…';
}

/**
 * Get entity URL for navigation
 */
export function getEntityUrl(entity: Entity): string {
  const { kind, metadata } = entity;
  const namespace = metadata.namespace || 'default';
  return `/catalog/${namespace}/${kind.toLowerCase()}/${metadata.name}`;
}

/**
 * Get TechDocs URL if available
 */
export function getTechDocsUrl(entity: Entity): string | undefined {
  const { kind, metadata } = entity;
  const namespace = metadata.namespace || 'default';
  
  if (!metadata.annotations?.['backstage.io/techdocs-ref']) {
    return undefined;
  }
  
  return `/docs/${namespace}/${kind.toLowerCase()}/${metadata.name}`;
}

/**
 * Check if entity has a specific annotation
 */
export function hasAnnotation(entity: Entity, annotation: string): boolean {
  return !!(entity.metadata.annotations?.[annotation]);
}

/**
 * Get formatted relative time
 */
export function formatRelativeTime(dateString?: string): string | undefined {
  if (!dateString) return undefined;
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  } catch {
    return undefined;
  }
}

/**
 * Sort entities by various criteria
 */
export const sortFunctions = {
  name: (a: Entity, b: Entity) => 
    (a.metadata.title || a.metadata.name).localeCompare(b.metadata.title || b.metadata.name),
  
  owner: (a: Entity, b: Entity) => {
    const ownerA = (a.spec as any)?.owner || '';
    const ownerB = (b.spec as any)?.owner || '';
    return ownerA.localeCompare(ownerB);
  },
  
  type: (a: Entity, b: Entity) => {
    const typeA = `${a.kind}-${(a.spec as any)?.type || ''}`;
    const typeB = `${b.kind}-${(b.spec as any)?.type || ''}`;
    return typeA.localeCompare(typeB);
  },
  
  updated: (a: Entity, b: Entity) => {
    const dateA = a.metadata.annotations?.['backstage.io/last-updated'] || '1970-01-01';
    const dateB = b.metadata.annotations?.['backstage.io/last-updated'] || '1970-01-01';
    return new Date(dateB).getTime() - new Date(dateA).getTime(); // Most recent first
  },
};

/**
 * Filter entities by search query
 */
export function filterEntitiesByQuery(entities: Entity[], query: string): Entity[] {
  if (!query.trim()) return entities;
  
  const searchTerm = query.toLowerCase();
  
  return entities.filter(entity => {
    const { metadata, spec = {} } = entity;
    
    // Search in title, name, description
    if (metadata.title?.toLowerCase().includes(searchTerm)) return true;
    if (metadata.name.toLowerCase().includes(searchTerm)) return true;
    if (metadata.description?.toLowerCase().includes(searchTerm)) return true;
    
    // Search in tags
    if (metadata.tags?.some(tag => tag.toLowerCase().includes(searchTerm))) return true;
    
    // Search in owner
    if (typeof spec.owner === 'string' && spec.owner.toLowerCase().includes(searchTerm)) return true;
    
    // Search in type
    if (typeof spec.type === 'string' && spec.type.toLowerCase().includes(searchTerm)) return true;
    
    return false;
  });
}