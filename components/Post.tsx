import { ArrowsExpandIcon } from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/outline'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import Button from './Button'

/*
  Post Component.
*/
export default function Post(props: Props) {
  const {
    index,
  } = props

  return (
    <div className="flex flex-col p-4 gap-y-4 divide-y divide-gray-200">
      <div className="flex justify-between items-center flex-wrap gap-y-4 cursor-pointer">
        <div className="flex gap-x-2">
          <div className="text-gray-400 text-base md:text-lg">
            {index}.
          </div>

          <div className="flex flex-col">
            <h3 className="text-base md:text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </h3>

            <h4 className="pt-1 text-sm text-gray-400">
              by kilariteja
            </h4>
          </div>
        </div>

        <div className="w-full md:w-auto flex justify-center gap-x-4">
          <Button
            icon={ArrowsExpandIcon}
            label="Expand"
          />

          <Button
            icon={CheckCircleIcon}
            label="Read"
          />

          <Button
            icon={ExternalLinkIcon}
          />
        </div>
      </div>

      <div>
        <div
          className="
            w-full max-w-3xl break-words mx-auto prose prose-img:rounded prose-a:text-blue-500 hover:prose-a:text-blue-600
            tracking-wide md:leading-8 prose-code:font-monospace prose-code:before:hidden prose-code:after:hidden
            prose-code:bg-black prose-code:text-white prose-code:font-normal prose-code:rounded
            prose-code:px-1 prose-code:mx-1 prose-hr:my-6 md:prose-hr:my-8
          "
        >
          <div id="readability-page-1" className="page">
              <i>
                  <b><a href="https://patreon.com/danluu">I'm trying some experimental tiers on Patreon</a></b> to see if I can get to
                  <a href="https://twitter.com/danluu/status/1456346963691991041">substack-like levels of financial support for this blog without moving to substack</a>!
              </i>
              <hr />
              <strong>The container throttling problem</strong>
              <p>
                  <i>
                      This is an excerpt from an internal document <b>David Mackey</b> and I co-authored in April 2019. The document is excerpted since much of the original doc was about comparing possible approaches to increasing efficency at
                      Twitter, which is mostly information that's meaningless outside of Twitter without a large amount of additional explanation/context.
                  </i>
              </p>
              <p>
                  At Twitter, most CPU bound services start falling over at around 50% reserved container CPU utilization and almost all services start falling over at not much more CPU utilization even though CPU bound services should,
                  theoretically, be able to get higher CPU utilizations. Because load isn't, in general, evenly balanced across shards and the shard-level degradation in performance is so severe when we exceed 50% CPU utilization, this makes the
                  practical limit much lower than 50% even during peak load events.
              </p>
              <p>
                  This document will describe potential solutions to this problem. We'll start with describing why we should expect this problem given how services are configured and how the Linux scheduler we're using works. We'll then look into
                  case studies on how we can fix this with config tuning for specific services, which can result in a 1.5x to 2x increase in capacity, which can translate into $[redacted]M/yr to $[redacted]M/yr in savings for large services. While
                  this is worth doing and we might get back $[redacted]M/yr to $[redacted]M/yr in <a href="https://en.wikipedia.org/wiki/Total_cost_of_ownership">TCO</a> by doing this for large services. Manually fixing services one at a time isn't
                  really scalable, so we'll also look at how we can make changes that can recapture some of the value for most services.
              </p>
              <h3 id="the-problem-in-theory">The problem, in theory</h3>
              <p>
                  Almost all services at Twitter run on Linux with <a href="https://en.wikipedia.org/wiki/Completely_Fair_Scheduler">the CFS scheduler</a>, using
                  <a href="https://www.kernel.org/doc/Documentation/cgroup-v2.txt">CFS bandwidth control quota</a> for isolation, with default parameters. The intention is to allow different services to be colocated on the same boxes without having
                  one service's runaway CPU usage impact other services and to prevent services on empty boxes from taking all of the CPU on the box, resulting in unpredictable performance, which service owners found difficult to reason about before
                  we enabled quotas. The quota mechanism limits the amortized CPU usage of each container, but it doesn't limit how many cores the job can use at any given moment. Instead, if a job "wants to" use more than that many cores over a
                  quota timeslice, it will use more cores than its quota for a short period of time and then get throttled, i.e., basically get put to sleep, in order to keep its amortized core usage below the quota, which is disastrous for <a href="https://danluu.com/latency-pitfalls/">tail latency</a><sup id="fnref:S"><a rel="footnote" href="#fn:S">1</a></sup>.
              </p>
              <p>
                  Since the vast majority of services at Twitter use thread pools that are much larger than their mesos core reservation, when jobs have heavy load, they end up requesting and then using more cores than their reservation and then
                  throttling. This causes services that are provisioned based on load test numbers or observed latency under load to over provision CPU to avoid violating their <a href="https://en.wikipedia.org/wiki/Service-level_objective">SLO</a>s.
                  They either have to ask for more CPUs per shard than they actually need or they have to increase the number of shards they use.
              </p>
              <p>
                  An old example of this problem was the JVM Garbage Collector. Prior to work on the JVM to make the JVM container aware, each JVM would default the GC parallel thread pool size to the number of cores on the machine. During a GC, all
                  these GC threads would run simultaneously, exhausting the cpu quota rapidly causing throttling. The resulting effect would be that a subsecond stop-the-world GC pause could take many seconds of wallclock time to complete. While the
                  GC issue has been fixed, the issue still exists at the application level for virtually all services that run on mesos.
              </p>
              <h3 id="the-problem-in-practice-case-study">The problem, in practice [case study]</h3>
              <p>As a case study, let's look at <code>service-1</code>, the largest and most expensive service at Twitter.</p>
              <p>
                  Below is the CPU utilization histogram for this service just as it starts failing its load test, i.e., when it's just above the peak load the service can handle before it violates its SLO. The x-axis is the number of CPUs used at a
                  given point in time and the y-axis is (relative) time spent at that utilization. The service is provisioned for 20 cores and we can see that the utilization is mostly significantly under that, even when running at nearly peak
                  possible load:
              </p>
              <p>
                  <img
                      src="https://danluu.com/images/cgroup-throttling/cpu-histogram-1.png"
                      alt="Histogram for service with 20 CPU quota showing that average utilization is much lower but peak utilization is significantly higher when the service is overloaded and violates its SLO"
                      width="1266"
                      height="658"
                  />
              </p>
              <p>
                  The problem is the little bars above 20. These spikes caused the job to use up its CPU quota and then get throttled, which caused latency to drastically increase, which is why the SLO was violated even though average utilization is
                  about 8 cores, or 40% of quota. One thing to note is that the sampling period for this graph was 10ms and the quota period is 100ms, so it's technically possible to see an excursion above 20 in this graph without throttling, but on
                  average, if we see a lot of excursions, especially way above 20, we'll likely get throttling.
              </p>
              <p>After reducing the thread pool sizes to avoid using too many cores and then throttling, we got the following CPU utilization histogram under a load test:</p>
              <p>
                  <img
                      src="https://danluu.com/images/cgroup-throttling/cpu-histogram-2.png"
                      alt="Histogram for service with 20 CPU quota showing that average utilization is much lower but peak utilization is significantly higher when the service is overloaded and violates its SLO"
                      width="1216"
                      height="548"
                  />
              </p>
              <p>
                  This is at 1.6x the load (request rate) of the previous histogram. In that case, the load test harness was unable to increase load enough to determine peak load for <code>service-1</code> because the service was able to handle so
                  much load before failure that the service that's feeding it during the load test couldn't keep it and send more load (although that's fixable, I didn't have the proper permissions to quickly fix it). [later testing showed that the
                  service was able to handle about 2x the capacity after tweaking the thread pool sizes]
              </p>
              <p>This case study isn't an isolated example — Andy Wilcox has looked at the same thing for <code>service-2</code> and found similar gains in performance under load for similar reasons.</p>
              <p>
                  For services that are concerned about latency, we can get significant latency gains if we prefer to get latency gains instead of cost reduction. For <code>service-1</code>, if we leave the provisioned capacity the same instead of
                  cutting by 2x, we see a 20% reduction in latency.
              </p>
              <p>
                  The gains for doing this for individual large services are significant (in the case of <code>service-1</code>, it's [mid 7 figures per year] for the service and [low 8 figures per year] including services that are clones of it, but
                  tuning every service by hand isn't scalable. That raises the question: how many services are impacted?
              </p>
              <h3 id="thread-usage-across-the-fleet">Thread usage across the fleet</h3>
              <p>
                  If we look at the number of active threads vs. number of reserved cores for moderate sized services (&gt;= 100 shards), we see that almost all services have many more threads that want to execute than reserved cores. It's not
                  uncommon to see tens of <a href="https://access.redhat.com/sites/default/files/attachments/processstates_20120831.pdf">runnable threads</a> per reserved core. This makes the <code>service-1</code> example, above, look relatively
                  tame, at 1.5 to 2 runnable threads per reserved core under load.
              </p>
              <p>
                  If we look at where these threads are coming from, it's common to see that a program has multiple thread pools where each thread pool is sized to either twice the number of reserved cores or twice the number of logical cores on the
                  host machine. Both inside and outside of Twitter, It's common to see advice that thread pool size should be 2x the number of logical cores on the machine. This advice probably comes from a workload like picking how many threads to
                  use for something like a gcc compile, where we don't want to have idle resources when we could have something to do. Since threads will sometimes get blocked and have nothing to do, going to 2x can increase throughput over 1x by
                  decreasing the odds that any core is every idle, and 2x is a nice, round, number.
              </p>
              <p>However, there are a few problems with applying this to Twitter applications:</p>
              <ol>
                  <li>Most applications have multiple, competing, thread pools</li>
                  <li>Exceeding the reserved core limit is extremely bad</li>
                  <li>Having extra threads working on computations can increase latency</li>
              </ol>
              <p>
                  The "we should provision 2x the number of logical cores" model assumes that we have only one main thread pool doing all of the work and that there's little to no downside to having threads that could do work sit and do nothing and
                  that we have a throughput oriented workload where we don't care about the deadline of any particular unit of work.
              </p>
              <p>With the CFS scheduler, threads that have active work that are above the core reservation won't do nothing, they'll get scheduled and run, but this will cause throttling, which negatively impacts tail latency.</p>
              <h3 id="potential-solutions">Potential Solutions</h3>
              <p>
                  Given that we see something similar looking to our case study on many services and that it's difficult to push performance fixes to a lot of services (because service owners aren't really incentivized to take performance
                  improvements), what can we do to address this problem across the fleet and just on a few handpicked large services? We're going to look at a list of potential solutions and then discuss each one in more detail, below.
              </p>
              <ul>
                  <li>Better defaults for cross-fleet threadpools (eventbus, netty, etc.)</li>
                  <li>Negotiating ThreadPool sizes via a shared library</li>
                  <li>CFS period tuning</li>
                  <li>CFS bandwidth slice tuning</li>
                  <li>Other scheduler tunings</li>
                  <li>CPU pinning and isolation</li>
                  <li>Overprovision at the mesos scheduler level</li>
              </ul>
              <h4 id="better-defaults-for-cross-fleet-threadpools">Better defaults for cross-fleet threadpools</h4>
              <p>
                  <b>Potential impact</b>: some small gains in efficiency<br />
                  <b>Advantages</b>: much less work than any comprehensive solution, can be done in parallel with more comprehensive solutions and will still yield some benefit (due to reduced lock contention and context switches) if other solutions
                  are in place.<br />
                  <b>Downsides</b>: doesn't solve most of the problem.
              </p>
              <p>
                  Many defaults are too large. Netty default threadpool size is 2x the reserved cores. In some parts of [an org], they use a library that spins up <a href="https://news.ycombinator.com/item?id=26643392">eventbus</a> and allocates a
                  threadpool that's 2x the number of logical cores on the host (resulting in [over 100] eventbus threads) when 1-2 threads is sufficient for most of their eventbus use cases.
              </p>
              <p>Adjusting these default sizes won't fix the problem, but it will reduce the impact of the problem and this should be much less work than the solutions below, so this can be done while we work on a more comprehensive solution.</p>
              <h4 id="negotiating-threadpool-sizes-via-a-shared-library-api">Negotiating ThreadPool sizes via a shared library (API)</h4>
              <p>[this section was written by <i>Vladimir Kostyukov</i>]</p>
              <p>
                  <b>Potential impact</b>: can mostly mitigate the problem for most services.<br />
                  <b>Advantages</b>: quite straightforward to design and implement; possible to make it first-class in <a href="https://kostyukov.net/posts/finagle-101/">Finagle</a>/Finatra.<br />
                  <b>Downsides</b>: Requires service-owners to opt-in explicitly (adopt a new API for constructing thread-pools).
              </p>
              <p>
                  CSL’s util library has a package that bridges in some integration points between an application and a JVM (util-jvm), which could be a good place to host a new API for negotiating the sizes of the thread pools required by the
                  application.
              </p>
              <p>
                  The look and feel of such API is effectively dictated by how granular the negotiation is needed to be. Simply contending on a total number of allowed threads allocated per process, while being easy to implement, doesn’t allow
                  distinguishing between application and IO threads. Introducing a notion of QoS for threads in the thread pool (i.e., “IO thread; can not block”, “App thread; can block”), on the other hand, could make the negotiation fine grained.
              </p>
              <h4 id="cfs-period-tuning">CFS Period Tuning</h4>
              <p>
                  <b>Potential impact</b>: small reduction tail latencies by shrinking the length of the time period before the process group’s CFS runtime quota is refreshed.<br />
                  <b>Advantages</b>: relatively straightforward change requiring few minimal changes.<br />
                  <b>Downsides</b>: comes at increased scheduler overhead costs that may offset the benefits and does not address the core issue of parallelism exhausting quota. May result in more total throttling.
              </p>
              <p>
                  To limit CPU usage, CFS operates over a time window known as the CFS period. Processes in a scheduling group take time from the CFS quota assigned to the cgroup and this quota is consumed over the cfs_period_us in CFS bandwidth
                  slices. By shrinking the CFS period, the worst case time between quota exhaustion causing throttling and the process group being able to run again is reduced proportionately. Taking the default values of a CFS bandwidth slice of 5ms
                  and CFS period of 100ms, in the worst case, a highly parallel application could exhaust all of its quota in the first bandwidth slice leaving 95ms of throttled time before any thread could be scheduled again.
              </p>
              <p>It's possible that total throttling would increase because the scheduled time over 100ms might not exceed the threshold even though there are (for example) 5ms bursts that exceed the threshold.</p>
              <h4 id="cfs-bandwidth-slice-tuning">CFS Bandwidth Slice Tuning</h4>
              <p>
                  <b>Potential impact</b>: small reduction in tail latencies by allowing applications to make better use of the allocated quota.<br />
                  <b>Advantages</b>: relatively straightforward change requiring minimal code changes.<br />
                  <b>Downsides</b>: comes at increased scheduler overhead costs that may offset the benefits and does not address the core issue of parallelism exhausting quota.
              </p>
              <p>
                  When CFS goes to schedule a process it will transfer run-time between a global pool and CPU local pool to reduce global accounting pressure on large systems.The amount transferred each time is called the "slice". A larger bandwidth
                  slice is more efficient from the scheduler’s perspective but a smaller bandwidth slice allows for more fine grained execution. In debugging issues in [link to internal JIRA ticket] it was determined that if a scheduled process fails
                  to consume its entire bandwidth slice, the default slice size being 5ms, because it has completed execution or blocked on another process, this time is lost to the process group reducing its ability to consume all available
                  resources it has requested.
              </p>
              <p>
                  The overhead of tuning this value is expected to be minimal, but should be measured. Additionally, it is likely not a one size fits all tunable, but exposing this to the user as a tunable has been rejected in the past in Mesos.
                  Determining a heuristic for tuning this value and providing a per application way to set it may prove infeasible.
              </p>
              <h4 id="other-scheduler-tunings">Other Scheduler Tunings</h4>
              <p>
                  <b>Potential Impact</b>: small reduction in tail latencies and reduced throttling.<br />
                  <b>Advantages</b>: relatively straightforward change requiring minimal code changes.<br />
                  <b>Downsides</b>: comes at potentially increased scheduler overhead costs that may offset the benefits and does not address the core issue of parallelism exhausting quota.
              </p>
              <p>
                  The kernel has numerous auto-scaling and auto-grouping features whose impact to scheduling performance and throttling is currently unknown. <code>kernel.sched_tunable_scaling</code> can adjust
                  <code>kernel.sched_latency_ns</code> underneath our understanding of its value. <code>kernel.sched_min_granularity_ns</code> and <code>kernel.sched_wakeup_granularity_ns</code> can be tuned to allow for preempting sooner, allowing
                  better resource sharing and minimizing delays. <code>kernel.sched_autogroup_enabled</code> may currently not respect <code>kernel.sched_latency_ns</code>leading to more throttling challenges and scheduling inefficiencies. These
                  tunables have not been investigated significantly and the impact of tuning them is unknown.
              </p>
              <h4 id="cfs-scheduler-improvements">CFS Scheduler Improvements</h4>
              <p>
                  <b>Potential impact</b>: better overall cpu resource utilization and minimized throttling due to CFS inefficiencies.<br />
                  <b>Advantages</b>: improvements are transparent to userspace.<br />
                  <b>Downsides</b>: the CFS scheduler is complex so there is a large risk to the success of the changes and upstream reception to certain types of modifications may be challenging.
              </p>
              <p>
                  How the CFS scheduler deals with unused slack time from the CFS bandwidth slice has shown to be ineffective. The kernel team has a patch to ensure that this unused time is returned back to the global pool for other processes to use,
                  <a href="https://lore.kernel.org/patchwork/patch/907450/">https://lore.kernel.org/patchwork/patch/907450/</a> to ensure better overall system resource utilization. There are some additional avenues to explore that could provide
                  further enhancements. Another of many recent discussions in this area that fell out of a k8s throttling issue(<a href="https://github.com/kubernetes/kubernetes/issues/67577">https://github.com/kubernetes/kubernetes/issues/67577</a>)
                  is <a href="https://lkml.org/lkml/2019/3/18/706">https://lkml.org/lkml/2019/3/18/706</a>.
              </p>
              <p>
                  Additionally, CFS may lose efficiency due to bugs such as [link to internal JIRA ticket] and <a href="http://www.ece.ubc.ca/~sasha/papers/eurosys16-final29.pdf">http://www.ece.ubc.ca/~sasha/papers/eurosys16-final29.pdf</a>. However,
                  we haven't spent much time looking at the CFS performance for Twitter’s particular use cases. A closer look at CFS may find ways to improve efficiency.
              </p>
              <p>Another change which has more upside and downside potential would be to use a scheduler other than CFS.</p>
              <h4 id="cpu-pinning-and-isolation">CPU Pinning and Isolation</h4>
              <p>
                  <b>Potential impact</b>: removes the concept of throttling from the system by making the application developer’s mental model of a CPU map to a physical one. <br />
                  <b>Advantages</b>: simplified understanding from application developer’s perspective, scheduler imposed throttling is no longer a concept an application contends with, improved cache efficiency, much less resource interference
                  resulting in more deterministic performance.<br />
                  <b>Disadvantages</b>: greater operational complexity, oversubscription is much more complicated, significant changes to current operating environment
              </p>
              <p>
                  The fundamental issue that allows throttling to occur is that a heavily threaded application can have more threads executing in parallel than the “number of CPUs” it requested resulting in an early exhaustion of available runtime.
                  By restricting the number of threads executing simultaneously to the number of CPUs an application requested there is now a 1:1 mapping and an application’s process group is free to consume the logical CPU thread unimpeded by the
                  scheduler. Additionally, by dedicating a CPU thread rather than a bandwidth slice to the application, the application is now able to take full advantage of CPU caching benefits without having to contend with other applications being
                  scheduled on the same CPU thread while it is throttled or context switched away.
              </p>
              <p>
                  In Mesos, implementing CPU pinning has proven to be quite difficult. However, in k8s there is existing hope in the form of a project from Intel known as the k8s CPU Manager. The CPU Manager was added as an alpha feature to k8s in
                  1.8 and has been enabled as a beta feature since 1.10. It has somewhat stalled in beta as few people seem to be using it but the core functionality is present. The performance improvements promoted by the CPU Manager project are
                  significant as shown in examples such as <a href="https://kubernetes.io/blog/2018/07/24/feature-highlight-cpu-manager/">https://kubernetes.io/blog/2018/07/24/feature-highlight-cpu-manager/</a> and
                  <a href="https://builders.intel.com/docs/networkbuilders/cpu-pin-and-isolation-in-kubernetes-app-note.pdf">https://builders.intel.com/docs/networkbuilders/cpu-pin-and-isolation-in-kubernetes-app-note.pdf</a> While these benchmarks
                  should be looked at with some skepticism, it does provide promising hope for exploring this avenue. A cursory inspection of the project highlights a few <a href="https://github.com/kubernetes/kubernetes/issues/70585">areas</a> where
                  work may still be needed but it is already in a usable state for validating the approach. Underneath, the k8s CPU Manager leverages the cpuset cgroup functionality that is present in the kernel.
              </p>
              <p>
                  Potentially, this approach does reduce the ability to oversubscribe the machines. However, the efficiency gains from minimized cross-pod interference, CPU throttling, a more deterministic execution profile and more may offset the
                  need to oversubscribe. Currently, the k8s CPU Manager does allow for minor oversubscription in the form of allowing system level containers and the daemonset to be oversubscribed, but on a pod scheduling basis the cpus are reserved
                  for that pod’s use.
              </p>
              <p>Experiments by Brian Martin and others have shown significant performance benefits from CPU pinning that are almost as large as our oversubscription factor.</p>
              <p>
                  Longer term, oversubscription could be possible through a multitiered approach of wherein a primary class of pods is scheduled using CPU pinning but a secondary class of pods that is not as latency sensitive is allowed to float
                  across all cores consuming slack resources from the primary pods. The work on the CPU Manager side would be extensive. However, recently
                  <a href="https://lwn.net/ml/linux-kernel/20190408214539.2705660-1-songliubraving@fb.com/">Facebook has been doing some work</a> on the kernel scheduler side to further enable this concept in a way that minimally impacts the primary
                  pod class that we can expand upon or evolve.
              </p>
              <h4 id="oversubscription-at-the-cluster-scheduler-level">Oversubscription at the cluster scheduler level</h4>
              <p>
                  <b>Potential impact</b>: can bring machine utilization up to an arbitrarily high level and overprovisioning "enough".<br />
                  <b>Advantages</b>: oversubscription at the cluster scheduler level is independent of the problem described in this doc; doing it in a data-driven way can drive machine utilization up without having to try to fix the specific
                  problems described here. This could simultaneously fix the problem in this doc (low CPU utilization due to overprovisioning to avoid throttling) while also fixing [reference to document describing another problem].<br />
                  <b>Disadvantages</b>: we saw in [link to internal doc] that shards of services running on hosts with high load have degraded performance. Unless we change the mesos scheduler to schedule based on actual utilization (as opposed to
                  reservation), some hosts would end up too highly loaded and services with shards that land on those hosts would have poor performance.
              </p>
              <h4 id="disable-cfs-quotas">Disable CFS quotas</h4>
              <p>
                  <b>Potential impact</b>: prevents throttling and allows services to use all available cores on a box by relying on the "shares" mechanism instead of quota.<br />
                  <b>Advantages</b>: in some sense, can gives us the highest possible utilization.<br />
                  <b>Disadvantages</b>: badly behaved services could severely interfere with other services running on the same box. Also, service owners would have a much more difficult time predicting the performance of their own service since
                  performance variability between the unloaded and loaded state would be much larger.
              </p>
              <p>
                  This solution is what was used before we enabled quotas. From a naive hardware utilization standpoint, relying on the shares mechanism seems optimal since this means that, if the box is underutilized, services can take unused cores,
                  but if the box becomes highly utilized, services will fall back to taking their share of cores, proportional to their core reseration. However, when we used this system, most service owners found it too difficult to estimate
                  performance under load for this to be practical. At least one company has tried this solution to fix their throttling problem and has had severe incidents under load because of it. If we switched back to this today, we'd be no
                  better off than we were before we were before we enabled quotes.
              </p>
              <p>
                  Given how we allocate capacity, two ingredients that would make this work better than it did before include having a more carefully controlled request rate to individual shards and a load testing setup that allowed service owners to
                  understand what things would really look like during a load spike, as opposed to our system, which only allows injection of unrealistic load to individual shards, which both has the problem that the request mix isn't the same as it
                  is under a real load spike and that the shard with injected load isn't seeing elevated load from other services running on the same box. Per [another internal document], we know that one of the largest factors impacting shard-level
                  performance is overall load on the box and that the impact on latency is non-linear and difficult to predict, so there's not really a good way to predict performance under actual load from performance under load tests with the load
                  testing framework we have today.
              </p>
              <p>
                  Although these missing ingredients are important, high impact, issues, addressing either of these issues is beyond the scope of this doc; [Team X] owns load testing and is working on load testing and it might be worth revisiting
                  this when the problem is solved.
              </p>
              <p>
                  An intermediate solution would be to set the scheduler quota to a larger value than the number of reserved cores in mesos, which would bound the impact of having "too much" CPU available causing unpredictable performance while
                  potentially reducing throttling when under high load because the scheduler will effective fall back to the shares mechanism if the box is highly loaded. For example, if the cgroup quota was twice the the mesos quota, services that
                  fall over at 50% of reserved mesos CPU usage would then instead fall over at 100% of reserved mesos CPU usage. For boxes at high load, the higher overall utilization would reduce throttling because the increased load from other
                  cores would mean that a service that has too many runnable threads wouldn't be able to have as many of those threads execute. This has a weaker version of the downside of disabling in quota, in that, from [internal doc], we know
                  that load on a box from other services is one of the largest factors in shard-level performance variance and this would, if we don't change how many mesos cores are reserved on a box, increase load on boxes. And if we do
                  proportionately decrease the number of mesos reserved cores on a box, that makes the change pointless in that it's equivalent to just doubling every service's CPU reservation, except that having it "secretly" doubled would probably
                  reduce the number of people who ask the question, "Why can't I exceed X% CPU in load testing without the service falling over?"
              </p>
              <h3 id="results">Results</h3>
              <p><i>This section was not in the original document from April 2019; it was written in December 2021 and describes work that happened as a result of the original document.</i></p>
              <p>
                  The suggestion of changing default thread pool sizes was taken and resulted in minor improvements. More importantly, two major efforts came out of the document. Vladimir Kostyukov (from the
                  <a href="https://finagle.github.io/blog/2021/03/31/quarterly/">CSL team</a>) and Flavio Brasil (from the JVM team) created
                  <a href="https://github.com/twitter/finagle/blob/develop/finagle-core/src/main/scala/com/twitter/finagle/filter/OffloadFilter.scala">Finagle Offload Filter</a> and Xi Yang (my intern
                  <sup id="fnref:I"><a rel="footnote" href="#fn:I">2</a></sup> at the time and now a full-time employee for my team) created a kernel patch which eliminates container throttling (the patch is still internal, but will hopefully
                  eventually upstreamed).
              </p>
              <p>
                  Almost all applications that run on mesos at Twitter run on top of <a href="https://kostyukov.net/posts/finagle-101/">Finagle</a>. The Finagle Offload Filter makes it trivial for service owners to put application work onto a
                  different thread pool than IO (which was often not previously happening). In combination with sizing thread pools properly, this resulted in, ceteris paribus, applications having
                  <a href="https://mobile.twitter.com/fbrasisil/status/1163974576511995904">drastically reduced latency</a>, enabling them to reduce their provisioned capacity and therefore their cost while meeting their SLO. Depending on the
                  service, this resulted in a 15% to 60% cost reduction for the service.
              </p>
              <p>
                  The kernel patch implements the obvious idea of preventing containers from using more cores than a container's quota at every moment instead of allowing a container to use as many cores as are available on the machine and then
                  putting the container to sleep if it uses too many cores to bring its amortized core usage down.
              </p>
              <p>
                  In experiments on hosts running major services at Twitter, this has the expected impact of eliminating issues related to throttling, giving a roughly 50% cost reduction for a typical service with untuned thread pool sizes. And it
                  turns out the net impact is larger than we realized when we wrote this document due to the reduction in interference caused by preventing services from using "too many" cores and then throttling
                  <sup id="fnref:M"><a rel="footnote" href="#fn:M">3</a></sup>. Also, although this was realized at the time, we didn't note in the document that the throttling issue causes shards to go from "basically totally fine" to a "throttling
                  death spiral" that's analogous to a "GC death spiral" with only a small amount of additional load, which increases the difficulty of operating systems reliably. What happens is that, when a service is under high load, it will
                  throttle. Throttling doesn't prevent requests from coming into the shard that's throttled, so when the shard wakes up from being throttled, it has even more work to do than it had before it throttled, causing it to use even more CPU
                  and throttle more quickly, which causes even more work to pile up. Finagle has a mechanism that can shed load for shards that are in very bad shape (clients that talk to the dead server will mark the server as dead and stop sending
                  request for a while) but, shards tend to get into this bad state when overall load to the service is high, so marking a node as dead just means that more load goes to other shards, which will then "want to" enter a throttling death
                  spiral. Operating in a regime where throttling can cause a death spiral is <a href="https://twitter.com/copyconstruct/status/1399766443596472320">an inherently metastable state</a>. Removing both of these issues is arguably as large
                  an impact as the cost reduction we see from eliminating throttling.
              </p>
              <p>
                  Xi Yang has experimented with variations on the naive kernel scheduler change mentioned above, but even the naive change seems to be quite effective compared to no change, even though the naive change does mean that services will
                  often not be able to hit their full CPU allocation when they ask for it, e.g., if a service requests no CPU for the first half a period and then requests infinite CPU for the second half of the period, under the old system, it would
                  get its allocated amount of CPU for the period, but under the new system, it would only get half. Some of Xi's variant patches address this issue in one way or another, but that has a relatively small impact compared to preventing
                  throttling in the first place.
              </p>
              <ul>
                  <li><a href="https://engineering.indeedblog.com/blog/2019/12/cpu-throttling-regression-fix/">https://engineering.indeedblog.com/blog/2019/12/cpu-throttling-regression-fix/</a></li>
                  <li>
                      Adding burstiness
                      <ul>
                          <li><a href="https://lore.kernel.org/lkml/20180522062017.5193-1-xiyou.wangcong@gmail.com/">https://lore.kernel.org/lkml/20180522062017.5193-1-xiyou.wangcong@gmail.com/</a></li>
                          <li><a href="https://lkml.org/lkml/2019/11/26/196">https://lkml.org/lkml/2019/11/26/196</a></li>
                          <li><a href="https://lwn.net/Articles/840595/">https://lwn.net/Articles/840595/</a></li>
                          <li>
                              A container that exceeds its allocation will still throttle, but the idea of "burst capacity" is added, allowing more margin before throttling while keeping basically the same average core utilization
                              <ul>
                                  <li>
                                      Allowing burstiness is independent of our fix, which prevents throttling and, in principle, both ideas could be applied at the same time, which would be somewhat like how network isolation works if you enable htb
                                      qdisc
                                  </li>
                                  <li>
                                      Given the workloads and configurations that Twitter has, this does not fix the throttling problem for us with respect to either achieving very high per-container CPU utilization or preventing a the metastability
                                      caused by threat of throttling death spiral, although it does allow us to use slightly more average CPU than without enabling burstiness
                                  </li>
                              </ul>
                          </li>
                      </ul>
                  </li>
                  <li>
                      Runtime level parallelism limiting
                      <ul>
                          <li>
                              Since Go typically uses a single thread pool, Uber was able to work around this issue by limiting the maximum number of running goroutines via
                              <a href="https://github.com/uber-go/automaxprocs">https://github.com/uber-go/automaxprocs</a>
                          </li>
                          <li>
                              Unfortunately for Twitter, a number of Twitter's largest and most expensive services, including <code>service-1</code>, use multiple language runtimes, so there isn't a simple way to bound the parallelism at the runtime
                              level
                          </li>
                      </ul>
                  </li>
              </ul>
              <p>
                  <i>
                      Thanks to Xi Yang, Ilya Pronin, Ian Downes, Rebecca Isaacs, Brian Martin, Vladimir Kotsyukov, Moses Nakamura, Flavio Brasil, Laurence Tratt, Akshay Shah, Julian Squires, Michael Greenberg and Miguel Angel Corral for
                      comments/corrections/discussion
                  </i>
              </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center py-6 gap-x-4">
        <Button
          icon={ArrowsExpandIcon}
          label="Expand"
        />

        <Button
          icon={CheckCircleIcon}
          label="Read"
        />

        <Button
          icon={ExternalLinkIcon}
        />
      </div>
    </div>
  )
}

interface Props {
  index?: number
}
