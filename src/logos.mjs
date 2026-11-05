import {escapeHtml} from './catalog.mjs';
// Brand assets belong to their owners and do not imply endorsement.
export const CARRIER_LOGOS = Object.freeze({
  "viettel": {
    "path": "./assets/carriers/viettel.png",
    "source": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Viettel_logo_2021.svg",
    "reference": "https://yourway.viettel.vn/"
  },
  "vinaphone": {
    "path": "./assets/carriers/vinaphone.png",
    "source": "https://upload.wikimedia.org/wikipedia/commons/9/96/Logo_vinaphone.png",
    "reference": "https://vnpt.vn/gioi-thieu/tin-tuc/luu-y-tai-va-su-dung-dung-logo-vinaphone-moi-nhat-hien-nay.html"
  },
  "mobifone": {
    "path": "./assets/carriers/mobifone.png",
    "source": "https://iconlogovector.com/uploads/images/2025/05/lg-68140ac36d2bf-MobiFone.webp",
    "reference": "https://www.mobifone.vn/"
  },
  "vietnamobile": {
    "path": "./assets/carriers/vietnamobile.png",
    "source": "https://logowik.com/content/uploads/images/993_vietnamobile.jpg",
    "reference": "https://www.vietnamobile.com.vn/"
  },
  "itel": {
    "path": "./assets/carriers/itel.png",
    "source": "https://my1.itel.vn/UploadTemp/d36a2d13-eb1a-4bd3-a161-e09d860f6073.jpg",
    "reference": "https://itel.vn/"
  },
  "wintel": {
    "path": "./assets/carriers/wintel.png",
    "source": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/34/2f/6b/342f6b53-f2e2-e213-32ce-44b3b5df1f1c/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/512x512bb.jpg",
    "reference": "https://wintel.vn/"
  },
  "local": {
    "path": "./assets/carriers/local.png",
    "source": "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/71/c1/b8/71c1b880-62e5-cb12-8ccd-a8d6f8ad6677/AppIcon-1x_U007emarketing-0-8-0-85-220-0.png/1200x630wa.png",
    "reference": "https://mylocal.vn/"
  },
  "vnsky": {
    "path": "./assets/carriers/vnsky.png",
    "source": "https://img.utdstc.com/icon/f27/d1e/f27d1e50821d023de460294425bb8d6e4fc5dcb9f97096aa73b333fae28cf83d%3A600",
    "reference": "https://www.vnsky.vn/"
  },
  "fpt": {
    "path": "./assets/carriers/fpt.png",
    "source": "https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-FPT.png",
    "reference": "https://fpt.com/-/media/project/fpt-corporation/fpt/common/fpt/file/stth-fpt_20230929.pdf"
  },
  "pottel": {
    "path": "./assets/carriers/pottel.png",
    "source": "https://pottel.vn/assets/logo.svg",
    "reference": "https://pottel.vn/vi"
  },
  "gmobile": {
    "path": "./assets/carriers/gmobile.png",
    "source": "https://cdn.bitrefill.com/content/cn/b_rgb%3AFFFFFF%2Cc_pad%2Ch_600%2Cw_800/v1647526143/gmobile-vietnam.webp",
    "reference": "https://beta.gmobile.vn/"
  },
  "skyfi": {
    "path": "./assets/carriers/skyfi.png",
    "source": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/bc/ae/53/bcae5319-e7e3-8c97-25cf-94eb375267fe/AppIcon-1x_U007emarketing-0-11-0-0-85-220-0.png/1200x630wa.png",
    "reference": "https://apps.apple.com/us/app/skyfi/id6747164804"
  }
});
export function carrierAvatarMarkup(profile, extraClass='') {
 const hue=escapeHtml(profile.hue||'teal');
 const symbol=escapeHtml(profile.symbol||'AP');
 const className=['carrier-avatar',extraClass,'hue-'+hue].filter(Boolean).join(' ');
 const logo=CARRIER_LOGOS[profile.id];
 if(!logo)return '<div class="'+className+'">'+symbol+'</div>';
 return '<div class="'+className+' has-logo" role="img" aria-label="Logo '+escapeHtml(profile.name)+'"><img class="carrier-logo" src="'+escapeHtml(logo.path)+'" alt="" width="98" height="44" loading="lazy" decoding="async"><span class="logo-fallback" aria-hidden="true">'+escapeHtml(profile.name||profile.symbol||'AP')+'</span></div>';
}
