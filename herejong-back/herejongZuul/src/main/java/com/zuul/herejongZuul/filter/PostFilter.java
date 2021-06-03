package com.zuul.herejongZuul.filter;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import javax.servlet.http.HttpServletResponse;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.springframework.util.StreamUtils;

public class PostFilter extends ZuulFilter {

  @Override
  public String filterType() {
    return "post";
  }

  @Override
  public int filterOrder() {
    return 1;
  }

  @Override
  public boolean shouldFilter() {
    return true;
  }

  @Override
  public Object run() {

    RequestContext ctx = RequestContext.getCurrentContext();
    HttpServletResponse request = ctx.getResponse();


   System.out.println("Response Status={}" + request.getStatus());

    try {

      InputStream is = ctx.getResponseDataStream();
    //  String respData = CharStreams.toString(new InputStreamReader(is,CharEncoding.UTF_8));
      String body = StreamUtils.copyToString(is, Charset.forName("UTF-8"));
   //   System.out.println("Response Data={}" + body);
      ctx.setResponseDataStream(new ByteArrayInputStream(body.getBytes("UTF-8")));
    //  ctx.setResponseBody(respData);

    }catch (IOException e)
    {
      e.printStackTrace();
    }


    return null;
  }

}