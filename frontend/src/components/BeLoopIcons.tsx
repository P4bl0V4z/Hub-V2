
import React from "react";
import {
  Home,
  BarChart2,
  CalendarDays,
  Globe,
  ClipboardList,
  Settings,
  Users,
  Mail,
  HeartHandshake,
  Package,
  FileCheck,
  Scale,
  Search,
  Filter,
  Download,
  Upload,
  BarChart,
  PieChart,
  LineChart,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Trash,
  Edit,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  MoreVertical,
  RefreshCcw,
  Zap,
  Shield,
  Clock,
  Map,
  Activity,
  Lock,
  Unlock,
  User,
  LogOut,
  ArrowRight,
  HelpCircle,
  Pause,
  CalendarDays as Calendar,
  BookOpen,
  FileText,
  ShieldCheck,
  FileWarning,
  Fingerprint,
  CalendarClock,
  BadgeCheck,
  ShieldAlert,
  FileLock,
  MapPin,
  SortAsc,
  SortDesc,
  Percent,
  FlaskConical,
  Check,
  MessageCircle,
  Play,
  CreditCard,
  Laptop
} from "lucide-react";

type IconProps = {
  name: string;
  size?: number;
  className?: string;
  color?: string;
  strokeWidth?: number;
};

// Icon mapping to ensure consistent usage across the application
const iconMapping: Record<string, React.ElementType> = {
  home: Home,
  chart: BarChart2,
  calendar: Calendar,
  globe: Globe,
  inventory: ClipboardList,
  settings: Settings,
  users: Users,
  mail: Mail,
  support: HeartHandshake,
  package: Package,
  fileCheck: FileCheck,
  scale: Scale,
  search: Search,
  filter: Filter,
  download: Download,
  upload: Upload,
  barChart: BarChart,
  pieChart: PieChart,
  lineChart: LineChart,
  checkCircle: CheckCircle,
  xCircle: XCircle,
  alertCircle: AlertCircle,
  info: Info,
  trash: Trash,
  edit: Edit,
  plus: Plus,
  minus: Minus,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  menu: Menu,
  moreVertical: MoreVertical,
  refresh: RefreshCcw,
  zap: Zap,
  shield: Shield,
  clock: Clock,
  map: Map,
  activity: Activity,
  lock: Lock,
  unlock: Unlock,
  user: User,
  logOut: LogOut,
  arrowRight: ArrowRight,
  helpCircle: HelpCircle,
  pause: Pause,
  book: BookOpen,
  fileText: FileText,
  shieldCheck: ShieldCheck,
  fileWarning: FileWarning,
  fingerprint: Fingerprint,
  calendarClock: CalendarClock,
  badgeCheck: BadgeCheck,
  shieldAlert: ShieldAlert,
  fileLock: FileLock,
  clipboardList: ClipboardList,
  bookOpen: BookOpen,
  calendarCheck: Calendar,
  mapPin: MapPin,
  sortAsc: SortAsc,
  sortDesc: SortDesc,
  percent: Percent,
  "flask-conical": FlaskConical,
  check: Check,
  messageCircle: MessageCircle,
  play: Play,
  creditCard: CreditCard,
  gmail: Mail,
  windows: Laptop
};

const BeLoopIcon: React.FC<IconProps> = ({ 
  name, 
  size = 20, 
  className = "", 
  color = "currentColor",
  strokeWidth = 1.5
}) => {
  const IconComponent = iconMapping[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon mapping.`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      className={className}
      color={color}
      strokeWidth={strokeWidth}
    />
  );
};

export default BeLoopIcon;
export { iconMapping };
