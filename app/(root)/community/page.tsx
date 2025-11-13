import React from 'react';

import UserCard from '@/components/cards/user.card';
import CommonFilter from '@/components/shared/common-filter';
import DataRenderer from '@/components/shared/data-renderer';
import LocalSearch from '@/components/shared/locale-search';
import Pagination from '@/components/shared/pagination';
import { UserFilters } from '@/constants/filters';
import { EMPTY_USERS } from '@/constants/states';
import { getAllUsers } from '@/lib/actions/user.action';

const CommunityPage = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getAllUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { users, isNext } = data || {};

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Community</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          iconPosition="left"
          imgSrc="/icons/search.svg"
          placeholder="There are some great devs here!"
          otherClasses="flex-1"
        />
        <CommonFilter filters={UserFilters} otherClasses="min-h-[56px] sm:min-w-[170px]" />
      </div>

      <DataRenderer
        success={success}
        error={error}
        data={users}
        empty={EMPTY_USERS}
        render={(users) => (
          <div className="mt-12 flex flex-wrap gap-5">
            {users.map((user) => (
              <UserCard key={user._id} {...user} />
            ))}
          </div>
        )}
      />

      <Pagination page={page} isNext={isNext || false} />
    </div>
  );
};

export default CommunityPage;
