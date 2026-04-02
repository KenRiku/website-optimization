import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TRACKING_SCRIPT = `
(function() {
  var sid = sessionStorage.getItem('_cw_sid');
  if (!sid) { sid = Math.random().toString(36).substr(2, 9) + Date.now().toString(36); sessionStorage.setItem('_cw_sid', sid); }

  var token = document.currentScript ? document.currentScript.src.split('/').slice(-1)[0].split('?')[0] : '';
  var api = document.currentScript ? new URL(document.currentScript.src).origin + '/api/events' : '/api/events';

  function send(type, data) {
    var payload = Object.assign({ sessionId: sid, pageUrl: window.location.href, eventType: type, token: token }, data);
    if (navigator.sendBeacon) { navigator.sendBeacon(api, JSON.stringify(payload)); }
    else { fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }); }
  }

  // Pageview
  send('pageview', {});

  // Clicks
  document.addEventListener('click', function(e) {
    var el = e.target;
    var selector = el.tagName.toLowerCase();
    if (el.id) selector += '#' + el.id;
    if (el.className && typeof el.className === 'string') selector += '.' + el.className.split(' ').join('.');
    send('click', { metadata: { selector: selector, text: el.innerText ? el.innerText.slice(0, 100) : '' } });
  }, true);

  // Scroll depth
  var scrollMarks = [25, 50, 75, 100];
  var fired = {};
  window.addEventListener('scroll', function() {
    var pct = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
    scrollMarks.forEach(function(m) { if (pct >= m && !fired[m]) { fired[m] = true; send('scroll', { metadata: { depth: m } }); } });
  }, { passive: true });
})();
`;

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const site = await prisma.site.findUnique({ where: { scriptToken: params.token } });

  const headers = {
    "Content-Type": "application/javascript",
    "Cache-Control": "public, max-age=3600",
    "Access-Control-Allow-Origin": "*",
  };

  if (!site) {
    return new NextResponse("// Invalid token", { headers });
  }

  return new NextResponse(TRACKING_SCRIPT, { headers });
}
