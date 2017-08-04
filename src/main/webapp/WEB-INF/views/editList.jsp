<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>  
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Collaborative Editor</title>
    <link href="/webjars/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="css/font-awesome.min.css" rel="stylesheet">
    <link href="css/animate.css" rel="stylesheet">
    <link href="css/main.css" rel="stylesheet">  
    <script src="/webjars/jquery/jquery.min.js"></script>
</head>
<body>
	<header class="navbar navbar-inverse navbar-fixed-top wet-asphalt" role="banner">
        <div class="container">
            <div class="navbar-header">
                <a class="navbar-brand" href="/" style="height: 80px;">Collaborative Editor</a>
            </div>
            <div class="collapse navbar-collapse">
                <ul class="nav navbar-nav navbar-right">
                    <li><a href="/">List</a></li>
                    <li><a href="/editor">New Contents</a></li>
                </ul>
            </div>
        </div>
    </header><!--/header-->
    <section id="title" class="emerald" style="padding: 30px 0;">
        <div class="container">
            <div class="row">
                <div class="col-sm-6">
                    <h3><i class="icon-angle-right"></i>  글 목록</h3>
                    <p>     제목을 클릭하면 내용 확인 및 편집이 가능합니다.</p>
                </div>
                <div class="col-sm-6">
                    <ul class="breadcrumb pull-right">
                        <li><a href="/editor">/ New contents /</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </section><!--/#title-->    

	<section id="blog" class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="blog">
                    <div class="blog-item">
                        <div class="blog-content">
                        	<h4><a href="/editor">제목입니다.</a></h4>
                            <div class="entry-meta">
                                <span><i class="icon-user"></i> 최근 작성자: ${content.latest_writer }</span>
                                <span><i class="icon-calendar"></i> 최근 저장일: ${content.date }</span>
                            </div>
                        </div>
                    </div><!--/.blog-item-->
                </div>
            </div><!--/.col-md-12-->
        </div><!--/.row-->
        
        <ul class="pager">
		<c:if test="${!contentPage.first }">
			<li class="previous">
				<a href="?page=${contentPage.number-1 }">&larr; Previous</a>
			</li>
		</c:if>
		<c:if test="${!contentPage.last }">
			<li class="next">
				<a href="?page=${contentPage.number+1 }">Next &rarr;</a>
			</li>
		</c:if>
		</ul>
    </section><!--/#blog-->
    
    <footer id="footer" class="midnight-blue">
        <div class="container">
            <div class="row">
                <div class="col-sm-6">
                    &copy; 2013 <a target="_blank" href="http://shapebootstrap.net/" title="Free Twitter Bootstrap WordPress Themes and HTML templates">ShapeBootstrap</a>. All Rights Reserved.
                </div>
                <div class="col-sm-6">
                    <ul class="pull-right">
                        <li><a href="/">List</a></li>
                    	<li><a href="/editor">New Contents</a></li>
                        <li><a id="gototop" class="gototop" href="#"><i class="icon-chevron-up"></i></a></li><!--#gototop-->
                    </ul>
                </div>
            </div>
        </div>
    </footer><!--/#footer-->

</div>
</body>
</html>