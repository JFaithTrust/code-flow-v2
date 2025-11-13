import JobCard from '@/components/cards/job.card';
import JobsFilter from '@/components/shared/job-filter';
import Pagination from '@/components/shared/pagination';
import { fetchCountries, fetchJobs, fetchLocation } from '@/lib/actions/job.action';

const Page = async ({ searchParams }: RouteParams) => {
  const { query, location, page } = await searchParams;
  const userLocation = await fetchLocation();

  const jobs = await fetchJobs({
    query: `${query}, ${location}` || `Software Engineer in ${userLocation}`,
    page: page ?? 1,
  });

  const countries = await fetchCountries();
  const parsedPage = parseInt(page ?? 1);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>

      <div className="flex">
        <JobsFilter countriesList={countries} />
      </div>

      <section className="mt-11 mb-9 flex flex-col gap-9 border-b light-border pb-9">
        {jobs?.length > 0 ? (
          jobs
            ?.filter((job: Job) => job.job_title)
            .map((job: Job, index: number) => <JobCard key={index} job={job} />)
        ) : (
          <div className="w-full text-center paragraph-regular text-dark200_light800">
            Oops! We couldn&apos;t find any jobs at the moment. Please try again later
          </div>
        )}
      </section>

      {jobs?.length > 0 && <Pagination page={parsedPage} isNext={jobs?.length === 10} />}
    </>
  );
};

export default Page;
