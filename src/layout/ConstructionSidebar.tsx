/**
 * Construction OS — Control Tower Sidebar
 * Wave C1 + VTI Absorption — Grouped navigation with collapsible sections.
 * Premium dark enterprise sidebar with section headers.
 */

import { useState } from 'react';
import { tokens } from '../ui/theme/tokens';
import { CONTROL_TOWER_NAV_GROUPS, type ControlTowerRoute } from './controlTowerTypes';

const t = tokens;

interface ConstructionSidebarProps {
  activeRoute: ControlTowerRoute;
  onNavigate: (route: ControlTowerRoute) => void;
}

export function ConstructionSidebar({ activeRoute, onNavigate }: ConstructionSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const sidebarWidth = collapsed ? 56 : 230;

  const toggleGroup = (label: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  return (
    <div
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        height: '100%',
        background: t.color.bgDeep,
        borderRight: `1px solid ${t.color.border}`,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: `width ${t.transition.normal}, min-width ${t.transition.normal}`,
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: collapsed ? '16px 8px' : '20px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0,
          borderBottom: `1px solid ${t.color.border}`,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: t.radius.md,
            background: t.color.accentPrimary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 800,
            color: '#ffffff',
            flexShrink: 0,
          }}
        >
          C
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div
              style={{
                fontSize: t.font.sizeSm,
                fontWeight: Number(t.font.weightBold),
                color: t.color.fgPrimary,
                whiteSpace: 'nowrap',
                letterSpacing: '0.02em',
              }}
            >
              Construction OS
            </div>
            <div
              style={{
                fontSize: t.font.sizeXs,
                color: t.color.fgMuted,
                whiteSpace: 'nowrap',
              }}
            >
              Control Tower
            </div>
          </div>
        )}
      </div>

      {/* Grouped Navigation */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '4px 0',
        }}
      >
        {CONTROL_TOWER_NAV_GROUPS.map((group) => {
          const isGroupCollapsed = collapsedGroups.has(group.label);
          const hasActiveItem = group.items.some((item) => item.id === activeRoute);

          return (
            <div key={group.label} style={{ marginBottom: 2 }}>
              {/* Group Header */}
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: 'calc(100% - 16px)',
                    margin: '4px 8px 2px',
                    padding: '4px 8px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '10px',
                    fontWeight: Number(t.font.weightSemibold),
                    fontFamily: t.font.family,
                    color: hasActiveItem ? t.color.fgSecondary : t.color.fgMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    textAlign: 'left',
                  }}
                >
                  <span>{group.label}</span>
                  <span style={{ fontSize: '8px', color: t.color.fgMuted }}>
                    {isGroupCollapsed ? '\u25B6' : '\u25BC'}
                  </span>
                </button>
              )}

              {/* Group Items */}
              {(!isGroupCollapsed || collapsed) &&
                group.items.map((item) => {
                  const isActive = activeRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      title={collapsed ? `${group.label} \u2014 ${item.label}` : undefined}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: collapsed ? 'calc(100% - 8px)' : 'calc(100% - 16px)',
                        margin: collapsed ? '1px 4px' : '1px 8px',
                        padding: collapsed ? '6px 0' : '5px 12px',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        border: 'none',
                        borderRadius: t.radius.md,
                        cursor: 'pointer',
                        fontSize: t.font.sizeXs,
                        fontWeight: isActive ? Number(t.font.weightSemibold) : Number(t.font.weightMedium),
                        fontFamily: t.font.family,
                        color: isActive ? '#ffffff' : t.color.fgSecondary,
                        background: isActive ? t.color.accentMuted : 'transparent',
                        borderLeft: isActive ? `3px solid ${t.color.accentPrimary}` : '3px solid transparent',
                        transition: `background ${t.transition.fast}, color ${t.transition.fast}`,
                        textAlign: 'left',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = t.color.bgHover;
                          e.currentTarget.style.color = t.color.fgPrimary;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = t.color.fgSecondary;
                        }
                      }}
                    >
                      <span
                        style={{
                          fontSize: '13px',
                          width: '18px',
                          textAlign: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </span>
                      {!collapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: '8px',
          cursor: 'pointer',
          color: t.color.fgMuted,
          fontSize: t.font.sizeXs,
          border: 'none',
          background: 'transparent',
          borderTop: `1px solid ${t.color.border}`,
          fontFamily: t.font.family,
          width: '100%',
          textAlign: 'left',
        }}
      >
        <span>{collapsed ? '\u203A' : '\u2039'}</span>
        {!collapsed && <span>Collapse</span>}
      </button>

      {/* Footer */}
      {!collapsed && (
        <div
          style={{
            padding: '8px 16px 12px',
            fontSize: '10px',
            color: t.color.fgMuted,
            letterSpacing: '0.05em',
          }}
        >
          Control Tower — Primary Surface
        </div>
      )}
    </div>
  );
}
