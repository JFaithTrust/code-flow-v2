import Image from 'next/image';
import Link from 'next/link';

import ROUTES from '@/constants/routes';
import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback } from '../ui/avatar';

interface UserAvatarProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
}

const UserAvatar = ({
  id,
  name,
  imageUrl,
  className = 'size-9',
  fallbackClassName,
}: UserAvatarProps) => {
  const initials = name
    .split(' ')
    .map((word: string) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={ROUTES.PROFILE(id)}>
      <Avatar className={`relative ${className}`}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`Avatar of ${name}`}
            fill
            quality={100}
            className="object-cover"
          />
        ) : (
          <AvatarFallback
            className={cn(
              'flex-center w-full font-space-grotesk font-bold tracking-wider text-white primary-gradient',
              fallbackClassName,
            )}
          >
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
